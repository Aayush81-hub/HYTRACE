import AnalysisClient from "./client";

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold">
          AI-Powered Market Analysis
        </h1>
        <p className="text-muted-foreground">
          Analyze GHC trading data to predict demand, identify inefficiencies,
          and receive optimized trading strategies.
        </p>
      </div>
      <AnalysisClient />
    </div>
  );
}
