import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Glorious Events 2026 - AI Talkshow & Workshop",
  description: "Join us for an exclusive AI Talkshow & Workshop in Harare with Alexander Morad, January 26-30, 2026",
  generator: "v0.app",
  icons: {
    icon: "/logo-glorios.png",
    apple: "/logo-glorios.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
