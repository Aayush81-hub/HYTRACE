'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ghcTokens as initialGhcTokens, GHCToken } from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'
import { Droplets, Sun, Wind, Loader, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type TransactionState = {
  [tokenId: number]: 'pending' | 'success' | 'idle'
}

export default function BuyerPage() {
  const { toast } = useToast()
  const [availableTokens, setAvailableTokens] = useState<GHCToken[]>(
    initialGhcTokens.filter((token) => token.status === 'Available')
  )
  const [transactions, setTransactions] = useState<TransactionState>({})

  const handleBuy = async (tokenToBuy: GHCToken) => {
    setTransactions((prev) => ({ ...prev, [tokenToBuy.id]: 'pending' }))

    // Simulate blockchain transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, you would interact with a smart contract here.
    // For now, we simulate a successful transaction.
    toast({
      title: 'Purchase Successful',
      description: `Transaction for GHC Token #${tokenToBuy.id} confirmed.`,
    })

    setTransactions((prev) => ({ ...prev, [tokenToBuy.id]: 'success' }))

    // Keep the success state for a bit before removing the token
    setTimeout(() => {
        setAvailableTokens((prevTokens) =>
            prevTokens.filter((token) => token.id !== tokenToBuy.id)
        );
    }, 1500)
  }
  
  const energyIcons = {
    Solar: <Sun className="h-4 w-4 text-yellow-500" />,
    Wind: <Wind className="h-4 w-4 text-blue-500" />,
    Hydro: <Droplets className="h-4 w-4 text-cyan-500" />,
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">
          Acquire Green Hydrogen Credits to meet your sustainability goals.
        </p>
      </div>
        <Card>
          <CardHeader>
            <CardTitle>Available GHC Tokens</CardTitle>
            <CardDescription>
              Browse and purchase GHC tokens from certified producers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token ID</TableHead>
                  <TableHead>Producer</TableHead>
                  <TableHead>Energy Source</TableHead>
                  <TableHead>Production Date</TableHead>
                  <TableHead className="text-right">Price (USD)</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableTokens.map((token) => (
                    <TableRow key={token.id} className={cn(transactions[token.id] === 'success' && 'opacity-50 transition-opacity duration-500')}>
                      <TableCell className="font-medium">#{token.id}</TableCell>
                      <TableCell>{token.producer}</TableCell>
                      <TableCell className="flex items-center gap-2">
                          {energyIcons[token.energySource]}
                          {token.energySource}
                      </TableCell>
                      <TableCell>{token.productionDate}</TableCell>
                      <TableCell className="text-right">
                        ${token.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant={transactions[token.id] === 'success' ? 'ghost' : 'default'}
                          size="sm"
                          disabled={transactions[token.id] === 'pending' || transactions[token.id] === 'success'}
                          onClick={() => handleBuy(token)}
                          className="w-24"
                        >
                          {transactions[token.id] === 'pending' && <Loader className="animate-spin" />}
                          {transactions[token.id] === 'success' && <CheckCircle className="text-green-500" />}
                          {!transactions[token.id] && 'Buy'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  )
}
