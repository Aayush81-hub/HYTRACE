
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
import { Badge } from '@/components/ui/badge'
import { GHCToken } from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Droplets, Sun, Wind, CheckCircle, Hourglass, Loader2, RefreshCw } from 'lucide-react'
import { useWallet } from '@/hooks/use-wallet'

type TransactionState = {
  [tokenId: number]: 'pending' | 'success' | 'idle'
}

export default function PortfolioPage() {
  const { toast } = useToast()
  const { account, contract } = useWallet();
  const [myGhcCredits, setMyGhcCredits] = useState<GHCToken[]>([]);
  const [transactions, setTransactions] = useState<TransactionState>({})
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyTokens = useCallback(async () => {
    if (!contract || !account) return;
    setIsLoading(true);
    try {
      // A more robust way to get tokens is to query all mint events
      // and then check the owner of each token.
      const issueFilter = contract.filters.CreditIssued();
      const issuedEvents = await contract.queryFilter(issueFilter);

      const tokens: GHCToken[] = [];

      for (const event of issuedEvents) {
          const tokenId = Number(event.args.tokenId);
          const owner = await contract.ownerOf(tokenId);

          if(owner.toLowerCase() === account.toLowerCase()){
              const details = await contract.creditDetails(tokenId);
              const status = details.isRetired ? 'Retired' : 'Owned';
              
              tokens.push({
                id: tokenId,
                producer: details.producer,
                energySource: details.energySource,
                productionDate: new Date(Number(details.productionDate) * 1000).toLocaleDateString(),
                price: 150, // Price would come from transaction history in a real app
                status: status,
                owner: account
              });
          }
      }
      
      setMyGhcCredits(tokens);

    } catch (error: any) {
      console.error("Failed to fetch your tokens:", error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your tokens from the blockchain. Make sure you are on the Sepolia network.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [contract, account, toast]);

  useEffect(() => {
    if (account && contract) {
      fetchMyTokens();
    } else {
      setMyGhcCredits([]); // Clear tokens if wallet is disconnected
    }
  }, [account, contract, fetchMyTokens]);


  const handleRetire = async (tokenId: number) => {
    if (!contract) {
        toast({ title: 'Error', description: 'Wallet not connected.', variant: 'destructive' });
        return;
    }
    
    setTransactions((prev) => ({ ...prev, [tokenId]: 'pending' }))

    try {
        const tx = await contract.retireCredit(tokenId);
        
        toast({
            title: "Retirement Submitted",
            description: `Retiring token #${tokenId}. Waiting for confirmation.`
        })

        await tx.wait();

        setTransactions((prev) => ({ ...prev, [tokenId]: 'success' }))

        toast({
          title: 'Retirement Successful',
          description: `GHC Token #${tokenId} has been retired.`,
        });

        // Update the token's status in the UI
        setMyGhcCredits((prevTokens) => 
            prevTokens.map(token => 
                token.id === tokenId ? { ...token, status: 'Retired' } : token
            )
        );

    } catch (error: any) {
        console.error("Retirement failed:", error);
        toast({
            title: 'Retirement Failed',
            description: error.reason || "An error occurred during the transaction.",
            variant: 'destructive'
        })
        setTransactions((prev) => ({ ...prev, [tokenId]: 'idle' }))
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
        <h1 className="font-headline text-4xl font-bold">My Portfolio</h1>
        <p className="text-black/80">
          Manage your purchased credits and retire them to claim their <span className="bg-secondary-accent p-1">environmental benefits.</span>
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My GHC Credits</CardTitle>
            <CardDescription>
                View your owned credits and retire them to claim their green benefits.
            </CardDescription>
          </div>
           <Button variant="outline" size="icon" onClick={fetchMyTokens} disabled={isLoading || !account}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token ID</TableHead>
                <TableHead>Energy Source</TableHead>
                <TableHead>Production Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-black" />
                      <p className="mt-2 text-black/80">Loading your tokens from the blockchain...</p>
                  </TableCell>
                </TableRow>
              ) : !account ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-black/80">
                      Please connect your wallet to view your portfolio.
                  </TableCell>
                </TableRow>
              ) : myGhcCredits.length > 0 ? (
                myGhcCredits.map((token) => (
                  <TableRow key={token.id}>
                    <TableCell className="font-medium">#{token.id}</TableCell>
                    <TableCell className="flex items-center gap-2">
                        {energyIcons[token.energySource]}
                        {token.energySource}
                    </TableCell>
                    <TableCell>{token.productionDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          token.status === 'Retired'
                            ? 'secondary'
                            : 'default'
                        }
                        className={cn(
                          'text-white',
                          token.status === 'Owned' &&
                            'bg-blue-500 hover:bg-blue-600',
                          token.status === 'Retired' &&
                            'bg-gray-500 hover:bg-gray-600'
                        )}
                      >
                          {token.status === 'Owned' && <Hourglass className="mr-2 h-3 w-3" />}
                          {token.status === 'Retired' && <CheckCircle className="mr-2 h-3 w-3" />}
                          {token.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={token.status === 'Retired' || transactions[token.id] === 'pending' || transactions[token.id] === 'success'}
                        onClick={() => handleRetire(token.id)}
                        className="w-24"
                      >
                        {transactions[token.id] === 'pending' && <Loader2 className="animate-spin" />}
                        {transactions[token.id] !== 'pending' && 'Retire'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-black/80">
                        You do not own any GHC tokens yet.
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

    