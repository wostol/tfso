import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Onest, Source_Sans_3, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const heading = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-heading-face',
})

const body = Source_Sans_3({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
})

const mono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono-face',
})

export const metadata: Metadata = {
  title: 'ТФСО — Томская федерация спортивного ориентирования',
  description:
    'Официальный сайт Томской федерации спортивного ориентирования: календарь соревнований, результаты и протоколы, карты районов, клубы и вступление в федерацию.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f0e3',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${heading.variable} ${body.variable} ${mono.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
