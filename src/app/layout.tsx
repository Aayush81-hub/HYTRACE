
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BrainCircuit,
  Home,
  Factory,
  ShoppingCart,
  Gavel,
  Coins,
} from 'lucide-react'

import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/icons'
import { cn } from '@/lib/utils'
import { WalletProvider } from '@/hooks/use-wallet'
import WalletConnect from '@/components/wallet-connect'
import { Smiley } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Hytrace Marketplace',
  description:
    'A decentralized marketplace for Green Hydrogen Credits (GHCs).',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <WalletProvider>
            <div className="relative flex min-h-screen w-full">
              <div className="absolute left-4 top-4 md:left-6 md:top-6">
                <Link href="/" className="flex items-center gap-2">
                  <span className="font-headline text-4xl font-black italic text-black">
                    HYTRACE
                  </span>
                </Link>
              </div>

               <div className="absolute right-4 top-4 md:right-6 md:top-6 flex items-center gap-4">
                <WalletConnect />
                <Smiley className="hidden h-8 w-8 text-black md:block" />
              </div>

              <main className="flex-1 overflow-y-auto p-4 pt-24 md:p-6 md:pt-24 lg:p-8 lg:pt-24">
                {children}
              </main>
            </div>
        </WalletProvider>
        <Toaster />
      </body>
    </html>
  )
}
