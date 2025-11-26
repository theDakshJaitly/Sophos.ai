import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react" // Added import for React
import { GeistSans } from 'geist/font'
import Script from 'next/script'
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react";
import { supabase } from '@/lib/supabase-client';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sophos",
  description: "Revolutionize your document workflow with AI-powered organization, summarization, and research.",
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Dev-only auth token injector: run before interactive so local dev API token
            is available for client requests. Keep only the script string inside
            <Script> — don't render React children into the script tag. */}
        <Script id="dev-auth-token" strategy="beforeInteractive">
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

        {/* App UI */}
        <Toaster />
        <Analytics />
        {children}
      </body>
    </html>
  )
}