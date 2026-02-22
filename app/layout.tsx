import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ProfileProvider } from '@/context/profile-context'
import { AuthWrapper } from '@/components/auth-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '3Jars - Money Management for Kids',
  description: 'A fun way to teach kids about spending, saving, and giving',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthWrapper>
          <ProfileProvider>
            {children}
          </ProfileProvider>
        </AuthWrapper>
      </body>
    </html>
  )
}