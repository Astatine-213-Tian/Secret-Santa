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

interface SecretSantaInvitationProps {
  eventName: string
  eventDate: string
  invitationLink: string
  organizerName: string
}

const SecretSantaInvitationEmail: React.FC<SecretSantaInvitationProps> = ({
  eventName,
  eventDate,
  invitationLink,
  organizerName,
}) => {
  return (
    <Html>
      <Head />
      <Preview>You've Been Invited to a Secret Santa Event!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Heading style={heading}>Secret Santa Invitation</Heading>

            <Section style={userGreeting}>
              <Text style={greetingText}>You're Invited! 🎅🎄</Text>
            </Section>

            <Text style={paragraph}>
              You've been invited to join the <b>{eventName}</b> Secret Santa
              gift exchange! The gift exchange will take place on{" "}
              <b>{eventDate}</b>. To participate and be assigned your gift
              recipient, please accept the invitation by clicking the button
              below.
            </Text>

            <Section style={buttonContainer}>
              <Button href={invitationLink} style={button}>
                Accept Invitation
              </Button>
            </Section>

            <Text style={paragraphSmall}>
              If the button above doesn't work, copy and paste the following
              link into your browser:
            </Text>

            <Section style={linkSection}>
              <Text style={linkText}>{invitationLink}</Text>
            </Section>

            <Text style={paragraph}>
              Once you accept, you'll be randomly assigned someone to give a
              gift to. Don't worry, the identity of your Secret Santa will
              remain a mystery until the big day!
            </Text>

            <Section style={footer}>
              <Text style={footerText}>
                This invitation was sent by {organizerName}. If you believe you
                received this invitation in error, please ignore this email.
              </Text>
              <Text style={copyrightText}>
                © {new Date().getFullYear()} Secret Santa App. All rights
                reserved.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

type SecretSantaInvitationWithPreview = React.FC<SecretSantaInvitationProps> & {
  PreviewProps: SecretSantaInvitationProps
}
;(SecretSantaInvitationEmail as SecretSantaInvitationWithPreview).PreviewProps =
  {
    eventName: "Office Holiday Party",
    eventDate: "December 15, 2025",
    invitationLink: "https://secretsanta.example.com/accept/abc123",
    organizerName: "John Doe",
  }

export const renderSecretSantaInvitationEmail = async (
  props: SecretSantaInvitationProps
) => {
  return await render(
    <SecretSantaInvitationEmail
      eventName={props.eventName}
      eventDate={props.eventDate}
      invitationLink={props.invitationLink}
      organizerName={props.organizerName}
    />
  )
}

export default SecretSantaInvitationEmail

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
  color: "#c62828", // Red color for Christmas theme
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 20px",
}

const userGreeting = {
  backgroundColor: "#f0f8ff",
  borderLeft: "4px solid #2e7d32", // Green color for Christmas theme
  padding: "15px",
  marginBottom: "20px",
}

const greetingText = {
  color: "#2e7d32", // Green color for Christmas theme
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
  backgroundColor: "#c62828", // Red color for Christmas theme
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
