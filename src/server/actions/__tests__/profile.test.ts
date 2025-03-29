import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getUserInfo } from "@/lib/auth/auth-server"
import { db } from "../../db"
import { user } from "../../db/schema"
import { updateProfile } from "../profile"

// Mock dependencies
vi.mock("@/lib/auth/auth-server", () => ({
  getUserInfo: vi.fn(),
}))

vi.mock("../../db", () => ({
  db: {
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue(undefined),
      })),
    })),
  },
}))

vi.mock("../../db/schema", () => ({
  user: {
    id: "id",
  },
}))

describe("updateProfile", () => {
  const mockUserInfo = {
    id: "user-123",
    email: "test@example.com",
    emailVerified: true,
    name: "Test User",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const validProfile = {
    name: "Test User",
    bio: "This is a test bio",
    giftPreferences: {
      likes: "Chocolates and books",
      dislikes: "Spicy food",
      sizes: "Medium",
      allergies: "None",
      additionalInfo: "I like surprise gifts!",
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getUserInfo).mockResolvedValue(mockUserInfo)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it("should update profile with valid inputs", async () => {
    await updateProfile(validProfile)

    expect(getUserInfo).toHaveBeenCalledTimes(1)
    expect(db.update).toHaveBeenCalledWith(user)
  })

  it("should throw error when user is not authenticated", async () => {
    vi.mocked(getUserInfo).mockRejectedValue(new Error("Not authenticated"))

    await expect(updateProfile(validProfile)).rejects.toThrow(
      "Not authenticated"
    )

    expect(db.update).not.toHaveBeenCalled()
  })

  it("should throw error when trying to update another user's profile", async () => {
    // This tests the case where somehow the user ID is manipulated
    const mockWhereMethod = vi
      .fn()
      .mockRejectedValue(new Error("Unauthorized action"))
    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: mockWhereMethod,
      }),
    } as any)

    await expect(updateProfile(validProfile)).rejects.toThrow(
      "Unauthorized action"
    )
  })

  it("should return error with invalid input - name too short", async () => {
    const invalidProfile = {
      ...validProfile,
      name: "a", // Name must be at least 2 characters per schema
    }

    const result = await updateProfile(invalidProfile as any)
    expect(result).toHaveProperty("error")
    expect(db.update).not.toHaveBeenCalled()
  })

  it("should return error with invalid input - bio too long", async () => {
    const invalidProfile = {
      ...validProfile,
      bio: "a".repeat(501), // Bio max length is 500 characters
    }

    const result = await updateProfile(invalidProfile as any)
    expect(result).toHaveProperty("error")
    expect(db.update).not.toHaveBeenCalled()
  })

  it("should return error with invalid input - missing required fields", async () => {
    const invalidProfile = {
      name: "Test User",
      // Missing bio and giftPreferences
    }

    const result = (await updateProfile(invalidProfile as any)) as {
      error: string
    }
    expect(result).toHaveProperty("error")
    expect(result.error).toContain("Required")
    expect(db.update).not.toHaveBeenCalled()
  })

  it("should return error with invalid input types", async () => {
    const invalidProfile = {
      name: 123, // Should be a string
      bio: "This is a test bio",
      giftPreferences: {
        likes: "Books",
        dislikes: "Spicy food",
        sizes: "Medium",
        allergies: "None",
        additionalInfo: "No additional info",
      },
    }

    const result = await updateProfile(invalidProfile as any)
    expect(result).toHaveProperty("error")
    expect(db.update).not.toHaveBeenCalled()
  })
})
