
'use client'

import React, { useState, useEffect } from 'react'
import { useWallet } from '@/hooks/use-wallet'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, AlertTriangle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'


export default function WalletConnect() {
  const { account, connectWallet, disconnectWallet, error } = useWallet()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Skeleton className="h-9 w-28 rounded-sm" />
  }

  if (account) {
    const truncatedAddress = `${account.substring(0, 6)}...${account.substring(
      account.length - 4
    )}`
    return (
      <div className="flex items-center gap-2">
         {error && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{error}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Wallet className="mr-2 h-4 w-4" />
              <span className="truncate">{truncatedAddress}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>{truncatedAddress}</DropdownMenuLabel>
              <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={disconnectWallet}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <>
      <Button onClick={connectWallet} variant="secondary">
        <Wallet className="mr-2 h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>
      {error && !account && <p className="ml-4 text-xs text-destructive">{error}</p>}
    </>
  )
}
