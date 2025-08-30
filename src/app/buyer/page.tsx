'use client'

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
import { ghcTokens } from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'
import { Droplets, Sun, Wind } from 'lucide-react'

export default function BuyerPage() {
  const { toast } = useToast()

  const handleBuy = (tokenId: number) => {
    toast({
      title: 'Purchase Successful',
      description: `You have successfully purchased GHC Token #${tokenId}.`,
    })
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
                {ghcTokens
                  .filter((token) => token.status === 'Available')
                  .map((token) => (
                    <TableRow key={token.id}>
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
                          variant="default"
                          size="sm"
                          onClick={() => handleBuy(token.id)}
                        >
                          Buy
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
