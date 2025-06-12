"use client";

import type { N8nWebhookResponse } from "@/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

type DataTableProps = {
  data: N8nWebhookResponse[];
};

function PriorityBadge({ priority }: { priority: "low" | "medium" | "high" }) {
  switch (priority) {
    case "low":
      return <Badge variant="outline" className="text-blue-600 border-blue-600">Low</Badge>;
    case "medium":
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-100/50">Medium</Badge>;
    case "high":
      return <Badge variant="outline" className="text-red-600 border-red-600 bg-red-100/50">High</Badge>;
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
}

function StatusIcon({ status }: { status: N8nWebhookResponse["status"] }) {
  switch (status) {
    case "Processed":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "Error":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "Pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    default:
      return null;
  }
}

export function DataTable({ data }: DataTableProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">N8N Processed Data</CardTitle>
        <CardDescription>View the data processed by your N8N workflows. Shows last 10 entries.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database-zap h-12 w-12 text-muted-foreground mb-4"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 12 22A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 12 15A9 3 0 0 0 21 12"/><path d="M13 22V17L10 20L13 17"/></svg>
            <p className="text-muted-foreground">No data processed yet.</p>
            <p className="text-sm text-muted-foreground">Submit data using the form above to see results here.</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
              <TableCaption>A list of recently processed N8N data entries.</TableCaption>
              <TableHeader className="sticky top-0 bg-background/90 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="w-[150px]">Agent Name</TableHead>
                  <TableHead>Task Description</TableHead>
                  <TableHead className="w-[100px] text-center">Priority</TableHead>
                  <TableHead className="w-[120px] text-center">Status</TableHead>
                  <TableHead className="w-[180px] text-right">Processed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{item.receivedData.agentName}</TableCell>
                    <TableCell className="max-w-xs truncate" title={item.receivedData.taskDescription}>
                      {item.receivedData.taskDescription}
                    </TableCell>
                    <TableCell className="text-center">
                      <PriorityBadge priority={item.receivedData.priority} />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center" title={item.status}>
                        <StatusIcon status={item.status} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {new Date(item.processedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
