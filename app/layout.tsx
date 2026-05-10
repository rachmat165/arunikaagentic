import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { initializeTracker } from '@/lib/init-tracker'

// Initialize ExecutionTracker on server startup
initializeTracker()

export const metadata: Metadata = {
  title: 'Arunika Agentic AI Dashboard',
  description: 'Executive dashboard for monitoring AI agents, tasks, and costs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-dark-900 text-gray-900 dark:text-white transition-colors">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto bg-gray-50 dark:bg-dark-800">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
