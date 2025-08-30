
'use client'

import { useWallet } from '@/hooks/use-wallet'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function WalletConnect() {
  const { account, connectWallet, disconnectWallet, error } = useWallet()

  if (account) {
    const truncatedAddress = `${account.substring(0, 6)}...${account.substring(
      account.length - 4
    )}`
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            <Wallet />
            <span>{truncatedAddress}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={disconnectWallet}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <Button onClick={connectWallet} className="w-full">
        <Wallet />
        <span>Connect Wallet</span>
      </Button>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </>
  )
}
