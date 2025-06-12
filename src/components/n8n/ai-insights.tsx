"use client";

import type { N8nWebhookResponse, AiSuggestion } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Cpu, Lightbulb, Loader2 } from "lucide-react";
import { getAiWorkflowSuggestions } from "@/lib/actions";
import { ScrollArea } from "../ui/scroll-area";

type AiInsightsProps = {
  dataForAnalysis: N8nWebhookResponse[];
};

export function AiInsights({ dataForAnalysis }: AiInsightsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const { toast } = useToast();

  const handleAnalyzeData = async () => {
    setIsLoading(true);
    setSuggestions([]);

    if (dataForAnalysis.length === 0) {
      toast({
        variant: "default",
        title: "No Data to Analyze",
        description: "Please submit some data first before generating AI insights.",
      });
      setIsLoading(false);
      return;
    }

    // Simulate AI analysis - replace with actual AI call
    const result = await getAiWorkflowSuggestions(dataForAnalysis);
    setIsLoading(false);

    if (result.success && result.suggestions) {
      if (result.suggestions.length > 0) {
        setSuggestions(result.suggestions as AiSuggestion[]);
        toast({
          title: "AI Insights Generated",
          description: "Suggestions for workflow improvements are now available.",
        });
      } else {
         toast({
          title: "AI Insights",
          description: "No specific new suggestions based on the current data, or not enough data.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: result.error || "Could not generate AI insights at this time.",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <Cpu className="mr-3 h-7 w-7 text-primary" />
          AI-Driven Insights
        </CardTitle>
        <CardDescription>
          Analyze processed data patterns to get suggestions for workflow improvements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAnalyzeData} disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Analyze Data & Suggest Improvements
        </Button>

        {suggestions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 font-headline">Suggestions:</h3>
            <ScrollArea className="h-[250px] rounded-md border p-4 bg-background">
              <ul className="space-y-4">
                {suggestions.map((suggestion) => (
                  <li key={suggestion.id} className="p-3 rounded-md border bg-card shadow-sm">
                    <p className="font-semibold text-primary">{suggestion.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                    <Badge variant="secondary" className="mt-2">{suggestion.category}</Badge>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}

        {!isLoading && suggestions.length === 0 && dataForAnalysis.length > 0 && (
           <div className="text-center text-muted-foreground p-4 border-dashed border-2 rounded-md mt-4">
             <p>Click the button above to generate AI insights based on the processed data.</p>
           </div>
        )}
         {!isLoading && suggestions.length === 0 && dataForAnalysis.length === 0 && (
           <div className="text-center text-muted-foreground p-4 border-dashed border-2 rounded-md mt-4 flex flex-col items-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
             <p>No data available for analysis.</p>
             <p className="text-sm">Submit data through the form to enable AI insights.</p>
           </div>
        )}

      </CardContent>
       {isLoading && (
        <CardFooter className="flex justify-center">
          <div className="flex items-center text-muted-foreground animate-pulse-subtle">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
            <span>Analyzing data and generating insights...</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
