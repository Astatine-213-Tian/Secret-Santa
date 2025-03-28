import nodemailer from "nodemailer"

interface SendEmailProps {
  to: string
  subject: string
  text: string
  html: string
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendEmail({ to, subject, text, html }: SendEmailProps) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  })
}
