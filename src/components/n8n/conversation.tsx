
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bot, User, MessageSquareDashed, RefreshCw } from "lucide-react";
import ReactMarkdown from 'react-markdown';

type ConversationProps = {
  history: string[];
  onNewChat: () => void;
};

export function Conversation({ history, onNewChat }: ConversationProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.firstElementChild as HTMLElement | null;
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [history]);

  return (
    <Card className="shadow-lg w-full flex-grow flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between shrink-0">
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
      <CardContent className="flex-1 min-h-0 p-0">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
            <MessageSquareDashed className="h-12 w-12 mb-3 text-muted-foreground" />
            <p>No interactions yet.</p>
            <p className="text-sm">Submit data through the form to see the log.</p>
          </div>
        ) : (
          <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
            <div className="space-y-4 p-4">
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
                        <div className="text-sm font-body">
                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-xl font-semibold my-2" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-lg font-semibold my-1.5" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-base font-semibold my-1" {...props} />,
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-2 pl-2" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 my-2 pl-2" {...props} />,
                              li: ({node, ...props}) => <li className="leading-snug" {...props} />,
                              a: ({node, ...props}) => <a className="underline hover:opacity-80" {...props} />,
                              code: ({node, inline, className, children, ...props}) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline ? (
                                  <pre className="bg-black/20 p-2 rounded-md my-2 text-xs overflow-x-auto font-code">
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                ) : (
                                  <code className="bg-black/20 px-1 py-0.5 rounded text-xs font-code" {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                              em: ({node, ...props}) => <em className="italic" {...props} />,
                            }}
                          >
                            {messageContent}
                          </ReactMarkdown>
                        </div>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground flex-shrink-0">
                        <Bot size={18} />
                      </span>
                    </div>
                  );
                } else {
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
