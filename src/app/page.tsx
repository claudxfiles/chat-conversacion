
"use client";

import { useState, useEffect, useRef } from "react";
import { Conversation } from "@/components/n8n/conversation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendDataToN8N } from "@/lib/actions";
import { Header } from "@/components/layout/header";
import { Send, Paperclip, XCircle, Loader2 } from "lucide-react";
import type { N8nFormData } from "@/types";
import Image from 'next/image';
import { cn } from "@/lib/utils";

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function HomePage() {
  const [conversationHistory, setConversationHistory] = useState<Array<{type: 'user' | 'bot' | 'system', content: string, image?: string}>>([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = await fileToDataUri(file);
      setSelectedFilePreview(previewUrl);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setSelectedFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleSendMessage = async () => {
    let userMessageContent = message.trim();
    let fileDataUri: string | undefined = undefined;
    let fileName: string | undefined = undefined;
    let fileMimeType: string | undefined = undefined;
    let userMessageForHistory = userMessageContent;

    if (selectedFile) {
      try {
        fileDataUri = await fileToDataUri(selectedFile);
        fileName = selectedFile.name;
        fileMimeType = selectedFile.type;
        if (!userMessageContent) {
          userMessageForHistory = `Sent file: ${selectedFile.name}`;
        }
      } catch (error) {
        console.error("Error converting file to Data URI:", error);
        setConversationHistory(prevHistory => [...prevHistory, {type: 'system', content: "Error: Could not process the selected file."}]);
        clearSelectedFile();
        return;
      }
    }

    if (userMessageContent || selectedFile) {
      const userEntry = {
        type: 'user' as const,
        content: userMessageForHistory || "Sent an attachment",
        image: selectedFile && fileMimeType?.startsWith('image/') ? fileDataUri : undefined
      };
      setConversationHistory(prevHistory => [...prevHistory, userEntry]);
      
      setMessage(""); 
      clearSelectedFile();

      const formData: N8nFormData = {
        taskDescription: userMessageContent, 
        ...(selectedFile && fileDataUri && { fileDataUri, fileName, fileMimeType }),
      };

      try {
        const response = await sendDataToN8N(formData);

        if (response.success && response.data) {
          const botResponseText = response.data.message || "Bot: Sorry, I couldn't get a response.";
          setConversationHistory(prevHistory => [...prevHistory, {type: 'bot', content: botResponseText}]);
        } else {
          const errorMessageText = response.error || 'An unknown error occurred processing your request.';
          setConversationHistory(prevHistory => [...prevHistory, {type: 'bot', content: `Error - ${errorMessageText}`}]);
        }
      } catch (error) {
        setConversationHistory(prevHistory => [...prevHistory, {type: 'bot', content: "Error - Could not connect to the service."}]);
      }
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleNewChat = () => {
    setConversationHistory([]);
    setMessage("");
    clearSelectedFile();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!isClient) {
    return (
      <div className="h-screen w-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col p-0 sm:p-4 md:p-6 lg:p-8 overflow-hidden min-h-0 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col p-0 sm:p-4 md:p-6 lg:p-8 overflow-hidden min-h-0">
        <Conversation history={conversationHistory} onNewChat={handleNewChat} />
        
        <div className={cn(
          "shrink-0 border-t bg-card/95 backdrop-blur-sm transition-all duration-300 ease-in-out",
          selectedFilePreview ? "max-h-40 opacity-100 p-3" : "max-h-0 opacity-0 p-0 border-transparent"
        )}>
          {selectedFilePreview && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                {selectedFile?.type.startsWith("image/") ? (
                  <Image src={selectedFilePreview} alt="Selected file preview" width={40} height={40} className="rounded object-cover flex-shrink-0 border" />
                ) : (
                  <Paperclip className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                )}
                <span className="text-sm text-muted-foreground truncate">{selectedFile?.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={clearSelectedFile} aria-label="Remove selected file">
                <XCircle className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t bg-card/95 backdrop-blur-sm p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button variant="outline" size="icon" className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-full" onClick={() => fileInputRef.current?.click()} aria-label="Attach file">
              <Paperclip size={20} />
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden"
              accept="image/*" 
            />
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
              placeholder="Type your message or attach a file..."
              className="flex-grow h-11 sm:h-12 text-base rounded-full px-5"
            />
            <Button onClick={handleSendMessage} className="h-11 sm:h-12 px-5 sm:px-6 rounded-full" aria-label="Send message">
              <Send size={20} />
              <span className="ml-2 hidden sm:inline">Send</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
