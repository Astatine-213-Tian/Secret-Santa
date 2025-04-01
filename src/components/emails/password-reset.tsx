import type React from "react"
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  render,
  Section,
  Text,
} from "@react-email/components"

interface PasswordResetEmailProps {
  resetPasswordLink: string
  expiryTime: string
}

const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  resetPasswordLink,
  expiryTime,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Reset Your Password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Heading style={heading}>Reset Your Password</Heading>

            <Section style={userGreeting}>
              <Text style={greetingText}>Password Reset Request 🔐</Text>
            </Section>

            <Text style={paragraph}>
              We received a request to reset your password. To create a new
              password and regain access to your account, please click the
              button below.
            </Text>

            <Section style={buttonContainer}>
              <Button href={resetPasswordLink} style={button}>
                Reset Password
              </Button>
            </Section>

            <Text style={paragraphSmall}>
              If the button above doesn't work, copy and paste the following
              link into your browser:
            </Text>

            <Section style={linkSection}>
              <Text style={linkText}>{resetPasswordLink}</Text>
            </Section>

            <Text style={paragraph}>
              This password reset link will <b>expire in {expiryTime}</b>. If
              you didn't request a password reset, please ignore this email or
              contact our support team if you have concerns about your account
              security.
            </Text>

            <Section style={securityNote}>
              <Text style={securityNoteText}>
                For security reasons, this link can only be used once. Never
                share this link with anyone.
              </Text>
            </Section>

            <Section style={footer}>
              <Text style={footerText}>
                If you didn't request a password reset, please ignore this email
                or contact our support team.
              </Text>
              <Text style={copyrightText}>
                © {new Date().getFullYear()} Your Company Name. All rights
                reserved.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

type PasswordResetEmailWithPreview = React.FC<PasswordResetEmailProps> & {
  PreviewProps: PasswordResetEmailProps
}
;(PasswordResetEmail as PasswordResetEmailWithPreview).PreviewProps = {
  resetPasswordLink: "https://example.com/reset-password?token=abc123",
  expiryTime: "1 hour",
}

export const renderPasswordResetEmail = async (
  props: PasswordResetEmailProps
) => {
  return await render(
    <PasswordResetEmail
      resetPasswordLink={props.resetPasswordLink}
      expiryTime={props.expiryTime}
    />
  )
}

export default PasswordResetEmail

// Styles
const main = {
  backgroundColor: "#f4f4f4",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
}

const content = {
  background: "#ffffff",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "40px",
}

const heading = {
  color: "#1565c0", // Blue color for security theme
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 20px",
}

const userGreeting = {
  backgroundColor: "#e3f2fd",
  borderLeft: "4px solid #1565c0", // Blue color for security theme
  padding: "15px",
  marginBottom: "20px",
}

const greetingText = {
  color: "#1565c0", // Blue color for security theme
  margin: "0",
  fontSize: "16px",
}

const paragraph = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "20px",
}

const paragraphSmall = {
  color: "#666666",
  fontSize: "14px",
  marginBottom: "10px",
}

const buttonContainer = {
  textAlign: "center" as const,
  marginBottom: "20px",
}

const button = {
  backgroundColor: "#1565c0", // Blue color for security theme
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "5px",
  textDecoration: "none",
  display: "inline-block",
  fontWeight: "bold",
}

const linkSection = {
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  padding: "10px",
  marginBottom: "20px",
}

const linkText = {
  color: "#666666",
  fontSize: "14px",
  wordBreak: "break-all" as const,
  margin: "0",
}

const securityNote = {
  backgroundColor: "#fff8e1", // Light amber for warning
  borderLeft: "4px solid #ffc107", // Amber for warning
  padding: "15px",
  marginBottom: "20px",
}

const securityNoteText = {
  color: "#bf360c", // Deep orange for emphasis
  margin: "0",
  fontSize: "14px",
}

const footer = {
  borderTop: "1px solid #e0e0e0",
  paddingTop: "20px",
  textAlign: "center" as const,
}

const footerText = {
  color: "#666666",
  fontSize: "12px",
  marginBottom: "10px",
}

const copyrightText = {
  color: "#999999",
  fontSize: "10px",
}
