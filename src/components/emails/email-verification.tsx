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

interface VerificationEmailProps {
  username: string
  verificationLink: string
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({
  username,
  verificationLink,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Verify Your Email Address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Heading style={heading}>Verify Your Email Address</Heading>

            <Section style={userGreeting}>
              <Text style={greetingText}>Hello, {username}! 👋</Text>
            </Section>

            <Text style={paragraph}>
              Thank you for signing up! To complete your registration and
              activate your account, please verify your email address by
              clicking the button below.
            </Text>

            <Section style={buttonContainer}>
              <Button href={verificationLink} style={button}>
                Verify Email Address
              </Button>
            </Section>

            <Text style={paragraphSmall}>
              If the button above doesn't work, copy and paste the following
              link into your browser:
            </Text>

            <Section style={linkSection}>
              <Text style={linkText}>{verificationLink}</Text>
            </Section>

            <Section style={footer}>
              <Text style={footerText}>
                This link will expire in 24 hours. If you didn't create an
                account, please ignore this email or contact our support team.
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

export const PreviewProps: VerificationEmailProps = {
  username: "John Doe",
  verificationLink: "https://example.com/verify",
}

export const renderVerificationEmail = async (
  props: VerificationEmailProps
) => {
  return await render(
    <VerificationEmail
      username={props.username}
      verificationLink={props.verificationLink}
    />
  )
}

export default VerificationEmail

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
  color: "#333333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 20px",
}

const userGreeting = {
  backgroundColor: "#f0f8ff",
  borderLeft: "4px solid #007bff",
  padding: "15px",
  marginBottom: "20px",
}

const greetingText = {
  color: "#007bff",
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
  backgroundColor: "#007bff",
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
