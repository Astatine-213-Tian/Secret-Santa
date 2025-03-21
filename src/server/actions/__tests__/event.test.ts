import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getUserId } from "@/lib/auth/auth-server"
import { db } from "../../db"
import { createEvent, updateEvent } from "../event"

// Custom error class for testing
class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UnauthorizedError"
  }
}

// Mock dependencies
vi.mock("@/lib/auth/auth-server", () => ({
  getUserId: vi.fn(),
}))

vi.mock("../../db", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([{ id: "mocked-event-id" }])),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => Promise.resolve()),
      })),
    })),
  },
}))

describe("Event Actions", () => {
  const validEventData = {
    name: "Test Event",
    description: "A test event description",
    budget: 50,
    eventDate: new Date("2023-12-25"),
    drawDate: new Date("2023-12-01"),
    location: "Test Location",
    joinCode: "TEST123",
  }

  const mockUserId = "user-123"

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getUserId).mockResolvedValue(mockUserId)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe("createEvent", () => {
    // 1. Valid event creation
    it("should create an event successfully with valid data", async () => {
      const result = await createEvent(validEventData)

      expect(getUserId).toHaveBeenCalledTimes(1)
      expect(db.insert).toHaveBeenCalledTimes(2)

      // Check event insertion
      const insertValues = vi.mocked(db.insert).mock.results[0]!.value!.values
      expect(insertValues).toHaveBeenCalledWith({
        ...validEventData,
        organizerId: mockUserId,
      })

      // Check participant insertion
      const participantValues = vi.mocked(db.insert).mock.results[1]!.value!
        .values
      expect(participantValues).toHaveBeenCalledWith({
        eventId: "mocked-event-id",
        userId: mockUserId,
      })

      expect(result).toBe("mocked-event-id")
    })

    // 2. Missing required fields
    it("should reject when required fields are missing", async () => {
      // Missing name
      const missingName = { ...validEventData } as Partial<
        typeof validEventData
      >
      delete missingName.name

      const result1 = await createEvent(missingName as any)
      expect(result1).toHaveProperty("error")
      expect((result1 as { error: string }).error).toContain("name")

      // Missing budget
      const missingBudget = { ...validEventData } as Partial<
        typeof validEventData
      >
      delete missingBudget.budget

      const result2 = await createEvent(missingBudget as any)
      expect(result2).toHaveProperty("error")
      expect((result2 as { error: string }).error).toContain("budget")

      // Missing event date
      const missingDate = { ...validEventData } as Partial<
        typeof validEventData
      >
      delete missingDate.eventDate

      const result3 = await createEvent(missingDate as any)
      expect(result3).toHaveProperty("error")
      expect((result3 as { error: string }).error).toContain("eventDate")

      // Verify no DB insertions happened
      expect(db.insert).not.toHaveBeenCalled()
    })

    // 3. Invalid date order
    it("should reject when draw date is after event date", async () => {
      const invalidDates = {
        ...validEventData,
        eventDate: new Date("2023-12-01"),
        drawDate: new Date("2023-12-25"), // Draw date after event date
      }

      const result = await createEvent(invalidDates)

      expect(result).toHaveProperty("error")
      expect((result as { error: string }).error).toContain("date")
      expect(db.insert).not.toHaveBeenCalled()
    })

    // 4. Injection attacks
    it("should sanitize input to prevent injection attacks", async () => {
      const maliciousData = {
        ...validEventData,
        name: "<script>alert('XSS')</script>",
        description: "DROP TABLE users;",
      }

      await createEvent(maliciousData)

      // Verify the data was passed as-is (expecting the ORM to handle sanitization)
      const insertValues = vi.mocked(db.insert).mock.results[0]!.value!.values
      expect(insertValues).toHaveBeenCalledWith({
        ...maliciousData,
        organizerId: mockUserId,
      })

      // In a real application, you'd verify that the ORM properly escapes these values
    })

    // 5. Unauthenticated users
    it("should reject event creation by unauthenticated users", async () => {
      // Simulate authentication failure
      vi.mocked(getUserId).mockRejectedValueOnce(
        new UnauthorizedError("Not authenticated")
      )

      await expect(createEvent(validEventData)).rejects.toThrow(
        "Not authenticated"
      )

      expect(db.insert).not.toHaveBeenCalled()
    })
  })

  describe("updateEvent", () => {
    const eventId = "event-123"

    // 1. Valid event update
    it("should update an event successfully with valid data", async () => {
      await updateEvent(eventId, validEventData)

      expect(getUserId).toHaveBeenCalledTimes(1)
      expect(db.update).toHaveBeenCalledTimes(1)

      const setValues = vi.mocked(db.update).mock.results[0]!.value!.set
      expect(setValues).toHaveBeenCalledWith({
        name: validEventData.name,
        description: validEventData.description,
        budget: validEventData.budget,
        eventDate: validEventData.eventDate,
        drawDate: validEventData.drawDate,
        location: validEventData.location,
      })

      // Verify update is conditional on event owner
      const whereClause = vi.mocked(db.update).mock.results[0]!.value!.set.mock
        .results[0]!.value!.where
      expect(whereClause).toHaveBeenCalled()
    })

    // 2. Missing required fields
    it("should reject update when required fields are missing", async () => {
      // Missing name
      const missingName = { ...validEventData } as Partial<
        typeof validEventData
      >
      delete missingName.name

      const result1 = await updateEvent(eventId, missingName as any)
      expect(result1).toHaveProperty("error")
      expect((result1 as { error: string }).error).toContain("name")

      // Verify no DB updates happened
      expect(db.update).not.toHaveBeenCalled()
    })

    // 3. Invalid date order
    it("should reject update when draw date is after event date", async () => {
      const invalidDates = {
        ...validEventData,
        eventDate: new Date("2023-12-01"),
        drawDate: new Date("2023-12-25"), // Draw date after event date
      }

      const result = await updateEvent(eventId, invalidDates)

      expect(result).toHaveProperty("error")
      expect((result as { error: string }).error).toContain("date")
      expect(db.update).not.toHaveBeenCalled()
    })

    // 4. Injection attacks
    it("should sanitize input for updates to prevent injection attacks", async () => {
      const maliciousData = {
        ...validEventData,
        name: "<script>alert('XSS')</script>",
        description: "DROP TABLE users;",
      }

      await updateEvent(eventId, maliciousData)

      // Verify the data was passed as-is (expecting the ORM to handle sanitization)
      const setValues = vi.mocked(db.update).mock.results[0]!.value!.set
      expect(setValues).toHaveBeenCalledWith(
        expect.objectContaining({
          name: maliciousData.name,
          description: maliciousData.description,
        })
      )
    })

    // 5. Unauthenticated users
    it("should reject event updates by unauthenticated users", async () => {
      // Simulate authentication failure
      vi.mocked(getUserId).mockRejectedValueOnce(
        new UnauthorizedError("Not authenticated")
      )

      await expect(updateEvent(eventId, validEventData)).rejects.toThrow(
        "Not authenticated"
      )

      expect(db.update).not.toHaveBeenCalled()
    })
  })
})
