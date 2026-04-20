import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'TalentBridge – Malaysia\'s Talent Ecosystem',
    template: '%s | TalentBridge',
  },
  description: 'Connect with top talent across Malaysia. AI-powered hiring, resume building, and career development in one platform.',
  keywords: ['jobs Malaysia', 'recruitment Malaysia', 'talent platform', 'career development', 'HR portal'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
