import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Math Problem Generator',
  description: 'AI-powered math problem generator for Primary 5 students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            loading: {
              duration: Infinity, // Loading toasts don't auto-dismiss
            },
            style: {
              background: '#fff',
              color: '#363636',
              border: '2px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
              style: {
                border: '2px solid #10b981',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              style: {
                border: '2px solid #ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  )
}