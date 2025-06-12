"use client";

import type { N8nWebhookResponse } from "@/types";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { N8nForm } from "@/components/n8n/n8n-form";
import { DataTable } from "@/components/n8n/data-table";
import { AiInsights } from "@/components/n8n/ai-insights";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  const [processedData, setProcessedData] = useState<N8nWebhookResponse[]>([]);

  const handleDataProcessed = (newData: N8nWebhookResponse) => {
    // Add new data to the beginning of the array and keep only the last 10 entries
    setProcessedData((prevData) => [newData, ...prevData].slice(0, 10));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
          <section aria-labelledby="n8n-form-section">
            <h2 id="n8n-form-section" className="sr-only">N8N Data Submission Form</h2>
            <N8nForm onDataProcessed={handleDataProcessed} />
          </section>
          
          <Separator className="my-8" />
          
          <section aria-labelledby="data-table-section">
            <h2 id="data-table-section" className="sr-only">Processed N8N Data Table</h2>
            <DataTable data={processedData} />
          </section>
          
          <Separator className="my-8" />
          
          <section aria-labelledby="ai-insights-section">
            <h2 id="ai-insights-section" className="sr-only">AI Workflow Insights</h2>
            <AiInsights dataForAnalysis={processedData} />
          </section>
        </div>
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        N8N Firebase Interface © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
