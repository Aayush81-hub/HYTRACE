
'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { Droplets, Sun, Wind, Loader, CheckCircle, RefreshCw } from 'lucide-react'
import { useWallet } from '@/hooks/use-wallet'
import { GHCToken } from '@/lib/mock-data' // Using type from mock-data
import { ethers } from 'ethers'

type TransactionState = {
  [tokenId: string]: 'pending' | 'success' | 'idle'
}

export default function BuyerPage() {
  const { toast } = useToast()
  const { account, contract } = useWallet();
  const [availableTokens, setAvailableTokens] = useState<GHCToken[]>([])
  const [transactions, setTransactions] = useState<TransactionState>({})
  const [isLoading, setIsLoading] = useState(true);

  const fetchAvailableTokens = useCallback(async () => {
    if (!contract) return;
    setIsLoading(true);
    try {
      // In a real app, you'd get available tokens from a marketplace contract or backend.
      // Here we simulate this by fetching all minted tokens and filtering them.
      const issueFilter = contract.filters.CreditIssued();
      const issuedEvents = await contract.queryFilter(issueFilter);

      const tokens: GHCToken[] = await Promise.all(issuedEvents.map(async (event) => {
        const args = event.args;
        const tokenId = Number(args.tokenId);
        const owner = await contract.ownerOf(tokenId);
        const details = await contract.creditDetails(tokenId);
        
        // A token is "Available" if it's not owned by the current user and not retired.
        const isAvailable = owner.toLowerCase() !== account?.toLowerCase() && !details.isRetired;
        
        return {
          id: tokenId,
          producer: args.producer,
          energySource: details.energySource,
          productionDate: new Date(Number(details.productionDate) * 1000).toLocaleDateString(),
          price: 150, // Price would come from a marketplace contract in a real app
          status: isAvailable ? 'Available' : 'Owned',
        };
      }));
      
      setAvailableTokens(tokens.filter(t => t.status === 'Available'));

    } catch (error) {
      console.error("Failed to fetch tokens:", error);
      toast({
        title: 'Error',
        description: 'Failed to fetch available tokens from the blockchain.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [contract, account, toast]);

  useEffect(() => {
    fetchAvailableTokens();
  }, [fetchAvailableTokens]);


  const handleBuy = async (tokenToBuy: GHCToken) => {
    if (!contract || !account) {
        toast({
            title: 'Error',
            description: 'Please connect your wallet to purchase tokens.',
            variant: 'destructive',
        });
        return;
    }

    setTransactions((prev) => ({ ...prev, [tokenToBuy.id]: 'pending' }))

    try {
        const tx = await contract.transferFrom(tokenToBuy.producer, account, tokenToBuy.id);
        
        toast({
            title: 'Purchase Submitted',
            description: `Transaction for GHC Token #${tokenToBuy.id} sent. Waiting for confirmation.`,
        });

        await tx.wait();

        toast({
          title: 'Purchase Successful',
          description: `Transaction for GHC Token #${tokenToBuy.id} confirmed.`,
        })

        setTransactions((prev) => ({ ...prev, [tokenToBuy.id]: 'success' }))
        
        setTimeout(() => {
            fetchAvailableTokens(); // Refresh the list after purchase
            setTransactions((prev) => ({ ...prev, [tokenToBuy.id]: 'idle' }))
        }, 1500);

    } catch (error: any) {
        console.error("Purchase failed:", error);
        toast({
            title: 'Purchase Failed',
            description: error.reason || 'An error occurred during the transaction.',
            variant: 'destructive'
        });
        setTransactions((prev) => ({ ...prev, [tokenToBuy.id]: 'idle' }))
    }
  }
  
  const energyIcons = {
    Solar: <Sun className="h-4 w-4 text-yellow-500" />,
    Wind: <Wind className="h-4 w-4 text-blue-500" />,
    Hydro: <Droplets className="h-4 w-4 text-cyan-500" />,
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-headline text-4xl font-bold">Marketplace</h1>
        <p className="text-black/80">
          Acquire <span className="highlight-yellow">Green Hydrogen Credits</span> to meet your sustainability goals.
        </p>
      </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Available GHC Tokens</CardTitle>
              <CardDescription>
                Browse and purchase GHC tokens from certified producers.
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={fetchAvailableTokens} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
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
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            <Loader className="mx-auto h-6 w-6 animate-spin text-black" />
                            <p className="mt-2 text-black/80">Loading tokens from the blockchain...</p>
                        </TableCell>
                    </TableRow>
                ) : availableTokens.length > 0 ? (
                  availableTokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">#{token.id}</TableCell>
                      <TableCell className="font-mono text-xs">{`${token.producer.substring(0,6)}...${token.producer.substring(token.producer.length - 4)}`}</TableCell>
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
                          disabled={!account || transactions[token.id] === 'pending' || transactions[token.id] === 'success'}
                          onClick={() => handleBuy(token)}
                          className="w-24"
                        >
                          {transactions[token.id] === 'pending' && <Loader className="animate-spin" />}
                          {transactions[token.id] === 'success' && <CheckCircle className="text-green-500" />}
                          {!transactions[token.id] && 'Buy'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-black/80">
                            No available tokens found on the marketplace.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  )
}
