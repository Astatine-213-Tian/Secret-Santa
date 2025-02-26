// Defines a component – a form to fill/modify event details to edit/create an event

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { EditableEventDetails } from "@/server/actions/event"
import { Button } from "@/components/ui/button"
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

export const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    location: z.string().min(1, "Location is required"),
    description: z.string().min(1, "Description is required"),
    budget: z
      .number({ required_error: "Budget is required" })
      .min(1, "Budget should be greater than 0"),
    eventDate: z.date({ required_error: "Event date is required" }),
    drawDate: z.date({ required_error: "Draw date is required" }),
  })
  .refine((data) => data.drawDate < data.eventDate, {
    message: "Draw date should be before event date",
    path: ["drawDate"],
  })

/**
 * A form to edit or create a new event
 * @param startValue (optional) The initial values for the form
 * @param handleSubmit The function to call when the form is submitted
 * @returns The form component
 * @useCases
 * 1. Creating a new event (startValue is undefined)
 * 2. Editing an existing event (startValue is the existing event details)
 */
export const EventForm = (params: {
  startValue?: EditableEventDetails
  submitButtonText: string
  handleSubmit: (data: EditableEventDetails) => void
}) => {
  const form = useForm<EditableEventDetails>({
    resolver: zodResolver(formSchema),
    defaultValues: params.startValue ?? {
      name: "",
      location: "",
      description: "",
      budget: 0,
      eventDate: undefined,
      drawDate: undefined,
    },
  })

  // Can only submit if changed data || form is valid
  const submitDisabled = !form.formState.isDirty || !form.formState.isValid

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(params.handleSubmit)}
        className="space-y-4"
      >
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
                    const newVal = e.target.value
                    if (newVal === "") {
                      field.onChange(null)
                      return
                    }
                    field.onChange(Number(newVal))
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      field.onChange(0)
                    }
                  }}
                  value={field.value === null ? "" : field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitDisabled}>
          {params.submitButtonText}
        </Button>
      </form>
    </Form>
  )
}
