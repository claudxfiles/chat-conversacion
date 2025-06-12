
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bot, User, MessageSquareDashed, RefreshCw } from "lucide-react";

type ConversationProps = {
  history: string[];
  onNewChat: () => void;
};

export function Conversation({ history, onNewChat }: ConversationProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <Card className="shadow-lg w-full flex-grow flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center">
            <Bot className="mr-3 h-7 w-7 text-primary" />
            N8N Interaction Log
          </CardTitle>
          <CardDescription>
            A log of data submissions and N8N responses.
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={onNewChat} aria-label="Start new chat">
          <RefreshCw size={18} />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0"> {/* Changed: removed overflow-hidden, added min-h-0 */}
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageSquareDashed className="h-12 w-12 mb-3 text-muted-foreground" />
            <p>No interactions yet.</p>
            <p className="text-sm">Submit data through the form to see the log.</p>
          </div>
        ) : (
          <ScrollArea className="flex-1" ref={scrollAreaRef}> {/* Changed: h-full flex-grow to flex-1 */}
             {/* Assign ref to viewport directly if possible, or adjust selector if ScrollArea nests it deeper under its own ref */}
            <div className="space-y-4 p-4" ref={viewportRef}> {/* Added direct ref to inner div for simpler scroll control, assuming ScrollArea passes it */}
              {history.map((entry, index) => {
                const isUserMessage = entry.toLowerCase().startsWith("user:");
                const isBotMessage = entry.toLowerCase().startsWith("bot:");
                
                let speaker = "";
                let messageContent = entry;

                if (isUserMessage) {
                  speaker = "User";
                  messageContent = entry.substring("User:".length).trim();
                } else if (isBotMessage) {
                  speaker = "Bot";
                  messageContent = entry.substring("Bot:".length).trim();
                }

                if (speaker === "User") {
                  return (
                    <div key={index} className="flex items-end space-x-3 justify-start">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                        <User size={18} />
                      </span>
                      <div className="p-3 rounded-lg rounded-bl-none bg-muted shadow max-w-[75%]">
                        <pre className="whitespace-pre-wrap text-sm font-body text-foreground">
                          {messageContent}
                        </pre>
                      </div>
                    </div>
                  );
                } else if (speaker === "Bot") {
                  return (
                    <div key={index} className="flex items-end space-x-3 justify-end">
                      <div className="p-3 rounded-lg rounded-br-none bg-primary text-primary-foreground shadow max-w-[75%]">
                        <pre className="whitespace-pre-wrap text-sm font-body">
                          {messageContent}
                        </pre>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground flex-shrink-0">
                        <Bot size={18} />
                      </span>
                    </div>
                  );
                } else {
                  // Fallback for messages not starting with User: or Bot:
                  return (
                     <div key={index} className="flex items-start space-x-3 justify-start">
                        <div className="p-3 rounded-lg bg-card shadow max-w-[75%]">
                          <pre className="whitespace-pre-wrap text-sm font-code text-muted-foreground">
                            {messageContent}
                          </pre>
                        </div>
                     </div>
                  );
                }
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

