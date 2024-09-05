import { Poppins } from 'next/font/google';

import '@/app/globals.css'
import { HomeButton } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import Image from 'next/image';

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: {
    default: 'Museum AI UI Chatbot',
  },
  description: 'An AI-powered chatbot to plan your museum with AI generated UI.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins', // Optional: If you want to use it as a CSS variable
  display: 'swap',
});

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={poppins.className}
        style={{
          backgroundImage: 'url("/Night_Watch.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom right',
        }}

      >
        <Toaster position="top-center" />
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <main className="flex flex-col flex-1">{children}</main>
          </div>
          <HomeButton />
        </Providers>
      </body>
    </html>
  )
}
