"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { GiftSubmitDetails } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { giftSubmitSchema } from "@/schemas/giftSubmit"

// TODO: allow the user to attach an image. Encode/store it.
/**
 * A form to edit or create a new event
 * @param initialValues (optional) The initial values for the form
 * @param handleSubmit The function to call when the form is submitted
 * @returns The form component
 * @useCases
 * 1. Creating a new event (initialValues is undefined)
 * 2. Editing an existing event (initialValues is the existing event details)
 */
export const GiftSubmitForm = (params: {
  handleSubmit?: (data: GiftSubmitDetails) => void
}) => {
  const form = useForm<GiftSubmitDetails>({
    resolver: zodResolver(giftSubmitSchema),
    defaultValues: {
      description: "",
      note: "",
    },
  })

  // Can only submit if changed data
  const submitDisabled = !form.formState.isDirty

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          params.handleSubmit?.(data)
          form.reset(data)
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Describe your Gift</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Write A Note</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Hope you enjoy the gift!" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end mt-2">
          <Button type="submit" disabled={submitDisabled}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
