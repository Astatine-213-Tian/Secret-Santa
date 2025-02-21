import type { Metadata } from "next"

import { Providers } from "./providers"

import "./globals.css"

export const metadata: Metadata = {
  title: "Secret Santa App",
  description: "A nextjs app for secret santa",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
