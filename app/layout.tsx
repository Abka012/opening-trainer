import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { Providers } from '@/providers/query-provider'
import './globals.css'

const _geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans'
})

const _geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: 'Chess Repertoire Manager',
  description: 'Build, organize, and practice your chess opening repertoire with an interactive board and spaced repetition.',
  keywords: ['chess', 'openings', 'repertoire', 'practice', 'ECO', 'study'],
}

export const viewport: Viewport = {
  themeColor: '#1a1a1d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased min-h-screen`}>
        <Providers>
          {children}
        </Providers>
        <Toaster 
          position="bottom-right" 
          theme="dark"
          toastOptions={{
            style: {
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
