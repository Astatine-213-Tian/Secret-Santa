"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { FormControl } from "./form"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface FormDatePickerProps<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>
}

export function FormDatePicker<T extends FieldValues>({
  field,
}: FormDatePickerProps<T>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) => date <= new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
