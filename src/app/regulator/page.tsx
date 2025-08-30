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
import { Badge } from '@/components/ui/badge'
import { auditLogs } from '@/lib/mock-data'
import { ArrowLeftRight, MinusCircle, PlusCircle } from 'lucide-react'

export default function RegulatorPage() {
    const eventDetails = {
        Mint: {
            icon: <PlusCircle className="h-4 w-4 text-green-500" />,
            badge: "secondary"
        },
        Transfer: {
            icon: <ArrowLeftRight className="h-4 w-4 text-blue-500" />,
            badge: "outline"
        },
        Retire: {
            icon: <MinusCircle className="h-4 w-4 text-red-500" />,
            badge: "destructive"
        }
    } as const;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold">Audit Trail</h1>
        <p className="text-muted-foreground">
          Permissioned, read-only access to the entire ledger for real-time auditing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Ledger</CardTitle>
          <CardDescription>
            A complete, immutable history of all GHC token events on the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tx Hash</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Token ID</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.txHash}>
                  <TableCell className="font-mono text-xs">{log.txHash}</TableCell>
                  <TableCell>
                    <Badge variant={eventDetails[log.eventType].badge}>
                      <div className="flex items-center gap-2">
                        {eventDetails[log.eventType].icon}
                        {log.eventType}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">#{log.tokenId}</TableCell>
                  <TableCell className="font-mono text-xs">{log.from}</TableCell>
                  <TableCell className="font-mono text-xs">{log.to}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
