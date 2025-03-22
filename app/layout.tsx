import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Randevu Sistemi - Online Berber Randevu',
  description: 'Online berber randevu sistemine hoş geldiniz! Kolayca randevu alabilir, hizmetlerimiz hakkında bilgi edinebilirsiniz.',
  generator: 'ilyasbozdemir.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
