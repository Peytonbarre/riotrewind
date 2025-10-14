import './global.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'League of Legends Stats',
  description: 'View League of Legends summoner stats',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}