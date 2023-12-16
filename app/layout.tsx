import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import AppWrapper from '@/components/AppWrapper'
import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'

const font = JetBrains_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yo',
  description: 'The bot that helps you manage your assets with Yearn Finance.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <html lang="en">
    <body className={`${font.className}`}>
      <AppWrapper>{children}</AppWrapper>
    </body>
  </html>
}
