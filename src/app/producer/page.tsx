
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Sun, Wind, Droplets, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

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

const formSchema = z.object({
  producerAddress: z.string().startsWith('0x', { message: "Must be a valid wallet address starting with '0x'" }).min(42, "Address must be 42 characters").max(42, "Address must be 42 characters"),
  energySource: z.enum(['Solar', 'Wind', 'Hydro']),
  productionDate: z.date(),
  mwhAmount: z.coerce.number().min(1, 'Must produce at least 1 MWh'),
})

export default function ProducerPage() {
  const { toast } = useToast()
  const { account } = useWallet()

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: 'Minting Successful!',
      description: `Successfully minted ${values.mwhAmount} GHC token(s) for ${values.producerAddress}.`,
    })
    // form.reset() would clear the address field even if connected, so we only reset the other fields
    form.reset({
        producerAddress: account || '', // Keep address if connected
        mwhAmount: 1,
        energySource: undefined,
        productionDate: undefined
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold">Mint Credits</h1>
        <p className="text-muted-foreground">
          Mint new Green Hydrogen Credits (GHCs) to list on the marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
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
                        <FormLabel>MWh Produced</FormLabel>
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
                                    !field.value && 'text-muted-foreground'
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

                    <Button type="submit" size="lg" className="w-full" disabled={!account}>
                    Mint Token
                    </Button>
                </form>
                </Form>
            )}
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-lg">
             <Image
              src="https://picsum.photos/600/800"
              alt="Wind turbines"
              fill
              className="object-cover"
              data-ai-hint="wind turbine"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 p-6 text-white">
                <h3 className="font-headline text-2xl font-bold">Powering the Green Revolution</h3>
                <p className="mt-2 text-white/80">Each GHC token you mint is a verifiable, immutable record of your contribution to a sustainable future. Trade your credits transparently and securely.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
