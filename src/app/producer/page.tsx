
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Sun, Wind, Droplets, AlertTriangle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { useWallet } from '@/hooks/use-wallet'
import { ethers } from 'ethers'

const formSchema = z.object({
  producerAddress: z.string().startsWith('0x', { message: "Must be a valid wallet address starting with '0x'" }).min(42, "Address must be 42 characters").max(42, "Address must be 42 characters"),
  energySource: z.enum(['Solar', 'Wind', 'Hydro']),
  productionDate: z.date(),
  mwhAmount: z.coerce.number().min(1, 'Must produce at least 1 MWh'),
})

export default function ProducerPage() {
  const { toast } = useToast()
  const { account, contract } = useWallet()
  const [isMinting, setIsMinting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      producerAddress: account || '',
      mwhAmount: 1,
    },
  })
  
  useEffect(() => {
    if(account) {
        form.setValue('producerAddress', account, { shouldValidate: true })
    } else {
        form.resetField('producerAddress')
    }
  }, [account, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!contract) {
        toast({
            title: 'Error',
            description: 'Smart contract not connected. Please connect your wallet.',
            variant: 'destructive'
        })
        return;
    }
    
    setIsMinting(true);

    try {
        // The contract expects a Unix timestamp for the date.
        const productionTimestamp = Math.floor(values.productionDate.getTime() / 1000);
        
        // The contract mints one token at a time. We'll loop for the mwhAmount.
        for (let i = 0; i < values.mwhAmount; i++) {
            const tx = await contract.certifyAndIssueCredit(
                values.producerAddress,
                values.energySource,
                productionTimestamp
            );
            
            toast({
                title: 'Transaction Submitted',
                description: `Minting token ${i + 1} of ${values.mwhAmount}. Transaction hash: ${tx.hash}`
            })

            // Wait for the transaction to be mined
            await tx.wait();
            
            toast({
                title: 'Minting Successful!',
                description: `Successfully minted token ${i + 1} of ${values.mwhAmount} for ${values.producerAddress}.`,
            })
        }
        
        form.reset({
            producerAddress: account || '',
            mwhAmount: 1,
            energySource: undefined,
            productionDate: undefined
        })

    } catch (error: any) {
        console.error("Minting failed:", error);
        toast({
            title: 'Minting Failed',
            description: error.reason || 'An error occurred during the transaction.',
            variant: 'destructive'
        })
    } finally {
        setIsMinting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-headline text-4xl font-bold">Mint Credits</h1>
        <p className="text-black/80">
          Mint new <span className="highlight-yellow">Green Hydrogen Credits (GHCs)</span> to list on the marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Mint New GHC Token</CardTitle>
            <CardDescription>
              Fill in the details below to mint a new GHC token for your green
              hydrogen production. 1 GHC = 1 MWh.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!account ? (
                 <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Wallet Not Connected</AlertTitle>
                    <AlertDescription>
                        Please connect your wallet to mint new GHC tokens. Your wallet address will be used as the producer address.
                    </AlertDescription>
                </Alert>
            ) : (
                <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                    control={form.control}
                    name="producerAddress"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Producer Wallet Address</FormLabel>
                        <FormControl>
                            <Input placeholder="0x..." {...field} disabled={!!account} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="mwhAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>MWh Produced (Number of tokens to mint)</FormLabel>
                        <FormControl>
                            <Input type="number" min="1" placeholder="e.g., 100" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="energySource"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Energy Source</FormLabel>
                            <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            >
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a source" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Solar">
                                <div className="flex items-center gap-2"><Sun className="h-4 w-4" /> Solar</div>
                                </SelectItem>
                                <SelectItem value="Wind">
                                <div className="flex items-center gap-2"><Wind className="h-4 w-4" /> Wind</div>
                                </SelectItem>
                                <SelectItem value="Hydro">
                                <div className="flex items-center gap-2"><Droplets className="h-4 w-4" /> Hydro</div>
                                </SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="productionDate"
                        render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Production Date</FormLabel>
                            <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant={'outline'}
                                    className={cn(
                                    'pl-3 text-left font-normal',
                                    !field.value && 'text-black/60'
                                    )}
                                >
                                    {field.value ? (
                                    format(field.value, 'PPP')
                                    ) : (
                                    <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date > new Date() || date < new Date('1990-01-01')
                                }
                                initialFocus
                                />
                            </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={!account || isMinting}>
                      {isMinting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isMinting ? 'MINTING...' : 'MINT TOKEN(S)'}
                    </Button>
                </form>
                </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
