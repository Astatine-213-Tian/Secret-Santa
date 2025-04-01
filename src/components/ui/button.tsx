"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button-variants"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loadingText,
      onClick,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = React.useState(false)

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!onClick) return

      try {
        const result = onClick(e) as unknown
        if (result instanceof Promise) {
          setIsLoading(true)
          await result
        }
      } catch (error) {
        console.error("Button click handler error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={onClick ? handleClick : undefined}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && !!loadingText ? loadingText : children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }
