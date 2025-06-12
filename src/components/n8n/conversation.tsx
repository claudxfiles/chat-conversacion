
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
  image?: string; // Data URI for user images
};

type ConversationProps = {
  history: ConversationEntry[];
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
                if (entry.type === "user") {
                  return (
                    <div key={index} className="flex items-end space-x-3 justify-start">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                        <User size={18} />
                      </span>
                      <div className="p-3 rounded-lg rounded-bl-none bg-muted shadow max-w-[75%]">
                        {entry.image && (
                           <Image src={entry.image} alt="User attachment" width={200} height={200} className="rounded-md mb-2 object-contain max-h-60" />
                        )}
                        <pre className="whitespace-pre-wrap text-sm font-body text-foreground">
                          {entry.content}
                        </pre>
                      </div>
                    </div>
                  );
                } else if (entry.type === "bot") {
                  return (
                    <div key={index} className="flex items-end space-x-3 justify-end">
                      <div className="p-3 rounded-lg rounded-br-none bg-primary text-primary-foreground shadow max-w-[75%]">
                        <div className="text-sm font-body">
                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-xl font-bold my-3" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-lg font-semibold my-2 pt-1" {...props} />,
                              h4: ({node, ...props}) => <h4 className="text-base font-semibold my-1.5" {...props} />,
                              p: ({node, ...props}) => <p className="leading-relaxed mb-1.5 last:mb-0" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc list-outside pl-6 my-2 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal list-outside pl-6 my-2 space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="leading-relaxed mb-0.5" {...props} />,
                              a: ({node, ...props}) => <a className="underline hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
                              code: ({node, inline, className, children, ...props}) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline ? (
                                  <pre
                                    className={cn(
                                      "bg-black/20 p-3 my-2 rounded-md overflow-x-auto font-code text-sm border border-white/20" ,
                                      "text-primary-foreground"
                                    )}
                                  >
                                    <code className={cn("text-primary-foreground", className)} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                ) : (
                                  <code
                                    className={cn(
                                      "bg-black/20 px-1.5 py-0.5 mx-0.5 rounded font-code text-sm",
                                      "text-primary-foreground" 
                                    )}
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                              em: ({node, ...props}) => <em className="italic" {...props} />,
                            }}
                          >
                            {entry.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground flex-shrink-0">
                        <Bot size={18} />
                      </span>
                    </div>
                  );
                } else { // system messages
                  return (
                     <div key={index} className="flex items-start justify-center">
                        <div className="p-2 rounded-lg bg-secondary text-secondary-foreground shadow text-xs max-w-[75%]">
                          <pre className="whitespace-pre-wrap font-body">
                            {entry.content}
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
