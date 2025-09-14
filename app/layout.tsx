import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react" // Added import for React
import { GeistSans } from 'geist/font' 
import Script from 'next/script'
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sophos",
  description: "Revolutionize your document workflow with AI-powered organization, summarization, and research.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script id="dev-auth-token" strategy="beforeInteractive">
        {children}
        <Toaster /> 
        <Analytics />
        
{`
try {
  if (typeof window !== 'undefined') {
    const existing = localStorage.getItem('token');
    if (!existing) {
      fetch('http://localhost:3001/api/dev/login')
        .then(r => r.json())
        .then(({ token }) => {
          if (token) localStorage.setItem('token', token);
        })
        .catch(() => {});
    }
  }
} catch {}
`}
        </Script>
        {children}
      </body>
    </html>
  )
}