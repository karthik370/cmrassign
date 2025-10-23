import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Handwriting PDF Generator - Convert Your Handwriting to PDFs',
  description:
    'Upload custom handwriting fonts and apply them to PDF documents. Free tool for students and professionals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
