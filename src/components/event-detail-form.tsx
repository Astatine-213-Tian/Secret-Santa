"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { eventDetailsSchema } from "@/schemas/event"

/**
 * A form to edit or create a new event
 * @param initialValues (optional) The initial values for the form
 * @param handleSubmit The function to call when the form is submitted
 * @returns The form component
 * @useCases
 * 1. Creating a new event (initialValues is undefined)
 * 2. Editing an existing event (initialValues is the existing event details)
 */
export const EventForm = (params: {
  initialValues?: z.infer<typeof eventDetailsSchema>
  submitButtonText: string
  handleSubmit: (data: z.infer<typeof eventDetailsSchema>) => void
}) => {
  const form = useForm<z.infer<typeof eventDetailsSchema>>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: params.initialValues ?? {
      name: "",
      location: "",
      description: "",
      budget: 20,
      eventDate: undefined,
      drawDate: undefined,
    },
  })

  // Can only submit if changed data
  const submitDisabled = !form.formState.isDirty

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          params.handleSubmit(data)
          form.reset(data)
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Office Christmas Party" />
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
                <Input {...field} placeholder="123 Main St, Anytown, USA" />
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
                <Textarea
                  {...field}
                  placeholder="Annual office Christmas party with gift exchange"
                />
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

        <div className="flex justify-end mt-2">
          <Button type="submit" disabled={submitDisabled}>
            {params.submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  )
}
