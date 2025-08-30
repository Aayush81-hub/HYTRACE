
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

export const metadata: Metadata = {
  title: 'Hytrace Marketplace',
  description:
    'A decentralized marketplace for Green Hydrogen Credits (GHC).',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <WalletProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader>
                <Link href="/" className="flex items-center gap-2">
                  <Logo className="size-8 text-primary" />
                  <span className="font-headline text-xl font-semibold">
                    Hytrace
                  </span>
                </Link>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/" tooltip="Dashboard">
                      <Home />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/producer" tooltip="Producer Hub">
                      <Factory />
                      <span>Mint Credits</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                    <SidebarMenuButton href="/portfolio" tooltip="My Portfolio">
                      <Coins />
                      <span>My Portfolio</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/buyer" tooltip="Marketplace">
                      <ShoppingCart />
                      <span>Marketplace</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/regulator" tooltip="Audit Trail">
                      <Gavel />
                      <span>Audit Trail</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="/analysis" tooltip="AI Analysis">
                      <BrainCircuit />
                      <span>AI Analysis</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                {/* The WalletConnect component was here. It is now in the header. */}
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <header className="flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:h-16">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1">
                  {/* Potentially add breadcrumbs or page title here */}
                </div>
                <WalletConnect />
              </header>
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </WalletProvider>
        <Toaster />
      </body>
    </html>
  )
}
