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
import { Badge } from '@/components/ui/badge'
import { myGhcCredits } from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Droplets, Sun, Wind, CheckCircle, Hourglass } from 'lucide-react'

export default function PortfolioPage() {
  const { toast } = useToast()

  const handleRetire = (tokenId: number) => {
    toast({
      title: 'Retirement Successful',
      description: `GHC Token #${tokenId} has been retired.`,
      variant: 'default',
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
        <h1 className="font-headline text-4xl font-bold">My Portfolio</h1>
        <p className="text-muted-foreground">
          Manage your purchased credits and retire them to claim their environmental benefits.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My GHC Credits</CardTitle>
          <CardDescription>
            View your owned credits and retire them to claim their green benefits.
          </CardDescription>
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
              {myGhcCredits.map((token) => (
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
                        token.status === 'Owned' &&
                          'bg-green-600 text-white hover:bg-green-700'
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
                      disabled={token.status === 'Retired'}
                      onClick={() => handleRetire(token.id)}
                    >
                      Retire
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
