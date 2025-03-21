"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { forgetPassword } from "@/lib/auth/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const ForgetPasswordFooter = () => {
  return (
    <CardFooter className="justify-center text-sm">
      Remember your password?&nbsp;
      <Link href="/login" className="underline underline-offset-4">
        Sign in
      </Link>
    </CardFooter>
  )
}

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
})

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error } = await forgetPassword({ email: values.email })
    if (error) {
      toast.error(error.message)
      return
    }
    setUserEmail(values.email)
    setIsSubmitted(true)
  }

  return (
    <div className="flex flex-col gap-6">
      {isSubmitted ? (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription>
              We've sent a password reset link to{" "}
              <span className="font-medium">{userEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-4">
                Click the link in the email to reset your password. If you don't
                see the email, check your spam folder.
              </p>
              <p>The link will expire in 24 hours.</p>
            </div>
          </CardContent>
          <ForgetPasswordFooter />
        </Card>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Forgot password?</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Sending..."
                    : "Send reset link"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <ForgetPasswordFooter />
        </Card>
      )}
    </div>
  )
}
