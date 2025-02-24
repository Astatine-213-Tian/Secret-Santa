"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { createEvent } from "@/server/actions/event"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FormDatePicker } from "@/components/ui/form-date-picker"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    location: z.string().min(1, "Location is required"),
    description: z.string().min(1, "Description is required"),
    budget: z
      .number({
        required_error: "Budget is required",
      })
      .min(0, "Budget should be greater than 0"),
    eventDate: z.date({
      required_error: "Event date is required",
    }),
    drawDate: z.date({
      required_error: "Draw date is required",
    }),
  })
  .refine((data) => data.drawDate < data.eventDate, {
    message: "Draw date should be before event date",
    path: ["drawDate"],
  })

export default function CreateEventPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      budget: 0,
      eventDate: undefined,
      drawDate: undefined,
    },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const eventId = await createEvent(data)
    router.push(`/event/${eventId}}`)
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Event</h1>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "mt-4")}
        >
          Back
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date</FormLabel>
                <FormDatePicker field={field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="drawDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Draw Date</FormLabel>
                <FormDatePicker field={field} />
                <FormDescription>
                  The date when participants will be randomly assigned their
                  secret gift recipients.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value))
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create Event</Button>
        </form>
      </Form>
    </main>
  )
}
