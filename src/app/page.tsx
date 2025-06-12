
"use client";

import { useState, useEffect, useRef } from "react";
import { Conversation } from "@/components/n8n/conversation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendDataToN8N } from "@/lib/actions";
import { Header } from "@/components/layout/header";
import { Send } from "lucide-react";
import type { N8nFormData } from "@/types";

export default function HomePage() {
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      const userMessage = `User: ${message}`;
      setConversationHistory(prevHistory => [...prevHistory, userMessage]);
      
      const currentMessage = message;
      setMessage(""); // Clear input immediately

      const formData: N8nFormData = {
        taskDescription: currentMessage, 
      };

      try {
        const response = await sendDataToN8N(formData);

        if (response.success && response.data) {
          const botResponseText = response.data.message || "Bot: Sorry, I couldn't get a response.";
          const botMessage = `Bot: ${botResponseText}`;
          setConversationHistory(prevHistory => [...prevHistory, botMessage]);
        } else {
          const errorMessageText = response.error || 'An unknown error occurred processing your request.';
          const errorMessage = `Bot: Error - ${errorMessageText}`;
          setConversationHistory(prevHistory => [...prevHistory, errorMessage]);
        }
      } catch (error) {
        const errorMessage = `Bot: Error - Could not connect to the service.`;
        setConversationHistory(prevHistory => [...prevHistory, errorMessage]);
      }
      
      inputRef.current?.focus(); 
    }
  };

  const handleNewChat = () => {
    setConversationHistory([]);
    setMessage("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="h-screen w-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden space-y-4 min-h-0">
        <Conversation history={conversationHistory} onNewChat={handleNewChat} />
        <div className="mt-auto flex items-center space-x-2 pb-2 shrink-0">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-grow h-12 text-base"
          />
          <Button onClick={handleSendMessage} className="h-12 px-6" aria-label="Send message">
            <Send size={20} />
            <span className="ml-2 hidden sm:inline">Send</span>
          </Button>
        </div>
      </main>
    </div>
  )
}
