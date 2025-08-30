'use server';
/**
 * @fileOverview Analyzes GHC trading data and market trends to provide insights.
 *
 * - analyzeGHCTradingData - A function that analyzes GHC trading data.
 * - AnalyzeGHCTradingDataInput - The input type for the analyzeGHCTradingData function.
 * - AnalyzeGHCTradingDataOutput - The return type for the analyzeGHCTradingData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeGHCTradingDataInputSchema = z.object({
  tradingData: z.string().describe('The GHC trading data to analyze.'),
});
export type AnalyzeGHCTradingDataInput = z.infer<typeof AnalyzeGHCTradingDataInputSchema>;

const AnalyzeGHCTradingDataOutputSchema = z.object({
  demandPrediction: z.string().describe('The predicted demand for GHC tokens.'),
  inefficienciesIdentified: z
    .string()
    .describe('The inefficiencies identified in the GHC trading market.'),
  optimizedTradingStrategies: z
    .string()
    .describe('The recommended optimized trading strategies for GHC tokens.'),
});
export type AnalyzeGHCTradingDataOutput = z.infer<typeof AnalyzeGHCTradingDataOutputSchema>;

export async function analyzeGHCTradingData(
  input: AnalyzeGHCTradingDataInput
): Promise<AnalyzeGHCTradingDataOutput> {
  return analyzeGHCTradingDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeGHCTradingDataPrompt',
  input: {schema: AnalyzeGHCTradingDataInputSchema},
  output: {schema: AnalyzeGHCTradingDataOutputSchema},
  prompt: `You are an AI assistant expert in analyzing Green Hydrogen Credit (GHC) trading data and market trends.

  Analyze the following GHC trading data to predict demand, identify inefficiencies, and recommend optimized trading strategies:
  {{tradingData}}

  Provide the demand prediction, identified inefficiencies, and optimized trading strategies in the output.
  `,
});

const analyzeGHCTradingDataFlow = ai.defineFlow(
  {
    name: 'analyzeGHCTradingDataFlow',
    inputSchema: AnalyzeGHCTradingDataInputSchema,
    outputSchema: AnalyzeGHCTradingDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
