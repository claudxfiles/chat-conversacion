
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User } from "lucide-react";

type ConversationProps = {
  history: string[];
};

export function Conversation({ history }: ConversationProps) {
  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <Bot className="mr-3 h-7 w-7 text-primary" />
          N8N Interaction Log
        </CardTitle>
        <CardDescription>
          A log of data submissions and N8N responses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-dashed h-12 w-12 mb-3"><path d="M3 6V5c0-1.1.9-2 2-2h2"/><path d="M11 3h3c1.1 0 2 .9 2 2v1"/><path d="M21 10v3c0 1.1-.9 2-2 2h-1"/><path d="M15 17h-2c-1.1 0-2-.9-2-2v-2"/><path d="M8 21v-1c0-1.1.9-2 2-2h1"/><path d="M3 12v3c0 1.1.9 2 2 2h3"/><path d="M3 10h2"/><path d="M5 21h2"/><path d="M19 3h2"/><path d="M21 5v2"/><path d="M17 21h2"/><path d="M19 17v2"/></svg>
            <p>No interactions yet.</p>
            <p className="text-sm">Submit data through the form to see the log.</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-muted/20">
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  {index % 2 === 0 && (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User size={18} />
                    </span>
                  )}
                  <div
                    className={`p-3 rounded-lg max-w-[75%] ${
                      index % 2 === 0
                        ? "bg-card shadow"
                        : "bg-primary/10 text-primary-foreground shadow"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap text-sm font-code">
                      {/* Attempt to parse and re-format JSON string for better readability */}
                      {(() => {
                        try {
                          const parsedJson = JSON.parse(entry);
                          // Basic formatting for N8nWebhookResponse structure
                          if (parsedJson && parsedJson.receivedData && parsedJson.receivedData.agentName) {
                            return `Agent: ${parsedJson.receivedData.agentName}\nTask: ${parsedJson.receivedData.taskDescription}\nPriority: ${parsedJson.receivedData.priority}\nStatus: ${parsedJson.status}\nMessage: ${parsedJson.message || 'N/A'}`;
                          }
                          return JSON.stringify(parsedJson, null, 2);
                        } catch (e) {
                          return entry; // If not JSON or parsing fails, show raw entry
                        }
                      })()}
                    </pre>
                  </div>
                  {index % 2 !== 0 && (
                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Bot size={18} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
