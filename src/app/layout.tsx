
import type { Metadata } from 'next'
import Link from 'next/link'

import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { WalletProvider } from '@/hooks/use-wallet'
import WalletConnect from '@/components/wallet-connect'
import { Smiley } from '@/components/icons'
import { Factory, Coins, Gavel, ShoppingCart, BarChart } from 'lucide-react'


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
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <WalletProvider>
            <div className="relative flex min-h-screen w-full flex-col">
              <header className="fixed top-0 z-50 w-full p-4 md:p-6">
                <div className="flex w-full items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                    <span className="font-headline text-4xl font-black italic text-black">
                        HYTRACE
                    </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <nav className="hidden items-center gap-2 md:flex">
                           <Button asChild variant="ghost">
                               <Link href="/producer"><Factory className="mr-2 h-4 w-4" /> Mint Credits</Link>
                           </Button>
                           <Button asChild variant="ghost">
                               <Link href="/buyer"><ShoppingCart className="mr-2 h-4 w-4" /> Marketplace</Link>
                           </Button>
                            <Button asChild variant="ghost">
                               <Link href="/portfolio"><Coins className="mr-2 h-4 w-4" /> My Portfolio</Link>
                           </Button>
                           <Button asChild variant="ghost">
                               <Link href="/analysis"><BarChart className="mr-2 h-4 w-4" /> Analysis</Link>
                           </Button>
                        </nav>
                        <WalletConnect />
                        <Smiley className="hidden h-8 w-8 text-black md:block" />
                    </div>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto p-4 pt-24 md:p-6 md:pt-24 lg:p-8 lg:pt-32">
                {children}
              </main>
            </div>
        </WalletProvider>
        <Toaster />
      </body>
    </html>
  )
}

    