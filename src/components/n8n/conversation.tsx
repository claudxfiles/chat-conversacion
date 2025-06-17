
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bot, User, MessageSquareDashed, RefreshCw } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import Image from "next/image";

type ConversationEntry = {
  type: 'user' | 'bot' | 'system';
  content: string;
  image?: string; 
};

type ConversationProps = {
  history: ConversationEntry[];
  onNewChat: () => void;
};

export function Conversation({ history, onNewChat }: ConversationProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector<HTMLElement>('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [history]);

  return (
    <Card className="shadow-lg w-full flex-grow flex flex-col overflow-hidden rounded-none sm:rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between shrink-0 px-4 py-3 sm:px-6 sm:py-4">
        <div className="space-y-1">
          <CardTitle className="font-headline text-xl sm:text-2xl flex items-center">
            <Bot className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            N8N Interaction Log
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            A log of data submissions and N8N responses.
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={onNewChat} aria-label="Start new chat" className="h-8 w-8 sm:h-9 sm:w-9">
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
            <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
              {history.map((entry, index) => {
                if (entry.type === "user") {
                  return (
                    <div key={index} className="flex items-end justify-end space-x-2 sm:space-x-3">
                      <div className="p-3 rounded-2xl rounded-br-md bg-primary text-primary-foreground shadow-md max-w-[75%] sm:max-w-[70%]">
                        {entry.image && (
                           <Image src={entry.image} alt="User attachment" width={200} height={200} className="rounded-md mb-2 object-contain max-h-60" />
                        )}
                        <pre className="whitespace-pre-wrap text-sm font-body">
                          {entry.content}
                        </pre>
                      </div>
                       <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary-foreground text-primary flex-shrink-0 shadow">
                        <User size={20} />
                      </span>
                    </div>
                  );
                } else if (entry.type === "bot") {
                  return (
                    <div key={index} className="flex items-end justify-start space-x-2 sm:space-x-3">
                       <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-accent text-accent-foreground flex-shrink-0 shadow">
                        <Bot size={20}/>
                      </span>
                      <div className="p-3 rounded-2xl rounded-bl-md bg-card text-card-foreground shadow-md max-w-[75%] sm:max-w-[70%]">
                        <div className="text-sm font-body">
                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4 text-primary" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-xl font-bold my-3 text-primary" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-lg font-semibold my-2 pt-1 text-primary" {...props} />,
                              h4: ({node, ...props}) => <h4 className="text-base font-semibold my-1.5 text-primary" {...props} />,
                              p: ({node, ...props}) => <p className="leading-relaxed mb-1.5 last:mb-0 text-card-foreground" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc list-outside pl-5 my-2 space-y-1 text-card-foreground" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal list-outside pl-5 my-2 space-y-1 text-card-foreground" {...props} />,
                              li: ({node, ...props}) => <li className="leading-relaxed mb-0.5 text-card-foreground" {...props} />,
                              a: ({node, ...props}) => <a className="text-primary underline hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
                              code: ({node, inline, className, children, ...props}) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline ? (
                                  <pre
                                    className={cn(
                                      "bg-muted/70 p-3 my-2 rounded-md overflow-x-auto font-code text-sm border border-border",
                                      "text-foreground" 
                                    )}
                                  >
                                    <code className={cn("text-foreground", className)} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                ) : (
                                  <code
                                    className={cn(
                                      "bg-muted/70 px-1.5 py-0.5 mx-0.5 rounded font-code text-sm",
                                      "text-foreground" 
                                    )}
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              strong: ({node, ...props}) => <strong className="font-semibold text-card-foreground" {...props} />,
                              em: ({node, ...props}) => <em className="italic text-card-foreground" {...props} />,
                            }}
                          >
                            {entry.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  );
                } else { 
                  return (
                     <div key={index} className="text-center py-2">
                        <span className="px-3 py-1 rounded-full bg-secondary/70 text-secondary-foreground/80 text-xs italic shadow-sm">
                            {entry.content}
                        </span>
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
