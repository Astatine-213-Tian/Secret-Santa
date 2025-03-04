"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mail } from "lucide-react"
import { toast } from "sonner"

import { sendVerificationEmail } from "@/lib/auth/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState<string>("")
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  async function handleResendEmail() {
    if (isResending || !email) return

    try {
      setIsResending(true)
      await sendVerificationEmail({ email })
      toast.success("Verification email has been sent")
    } catch (error) {
      console.error("Failed to resend verification email:", error)
      toast.error("Failed to resend verification email. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Verify your email</CardTitle>
          <CardDescription>
            {email ? (
              <>
                We've sent a verification link to{" "}
                <span className="font-medium">{email}</span>
              </>
            ) : (
              "We've sent a verification link to your email"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="text-center text-sm text-muted-foreground">
              Please check your email and click the verification link to
              complete your registration. If you don't see the email, check your
              spam folder.
            </div>

            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendEmail}
                disabled={isResending || !email}
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </Button>

              <div className="text-center text-sm">
                <Link href="/login" className="underline underline-offset-4">
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground">
        Need help?{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Contact support
        </a>
      </div>
    </div>
  )
}
