'use client'

import { useFormState, useFormStatus } from 'react-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { analyzeGHCTradingData } from '@/ai/flows/analyze-ghc-trading-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader, Sparkles, Lightbulb, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const initialState = {
  demandPrediction: '',
  inefficienciesIdentified: '',
  optimizedTradingStrategies: '',
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Analyze Data
    </Button>
  )
}

export default function AnalysisClient() {
  const [state, formAction] = useFormState(analyzeGHCTradingData, initialState)
  const { pending } = useFormStatus()

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Trading Data Input</CardTitle>
          <CardDescription>
            Paste your raw GHC trading data below. The more data you provide,
            the more accurate the analysis will be.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="tradingData">GHC Trading Data</Label>
              <Textarea
                placeholder="Example: timestamp,tokenId,price,volume..."
                id="tradingData"
                name="tradingData"
                rows={15}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <div className="space-y-6">
        <h2 className="font-headline text-2xl font-bold">Analysis Results</h2>
        {pending && !state.demandPrediction && (
          <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-60" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-[80%]" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-60" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-[90%]" />
                </CardContent>
            </Card>
          </div>
        )}
        
        {state.demandPrediction && (
            <Alert className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Demand Prediction</AlertTitle>
                <AlertDescription>{state.demandPrediction}</AlertDescription>
            </Alert>
        )}
        {state.inefficienciesIdentified && (
            <Alert className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500 delay-150">
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Inefficiencies Identified</AlertTitle>
                <AlertDescription>{state.inefficienciesIdentified}</AlertDescription>
            </Alert>
        )}
        {state.optimizedTradingStrategies && (
            <Alert className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500 delay-300">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Optimized Trading Strategies</AlertTitle>
                <AlertDescription>{state.optimizedTradingStrategies}</AlertDescription>
            </Alert>
        )}
      </div>
    </div>
  )
}
