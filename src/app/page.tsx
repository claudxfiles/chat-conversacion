
"use client";

import { useState, useEffect, useRef } from "react";
import { Conversation } from "@/components/n8n/conversation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendDataToN8N } from "@/lib/actions";
import { Header } from "@/components/layout/header";
import { Send, Paperclip, XCircle } from "lucide-react";
import type { N8nFormData } from "@/types";
import Image from 'next/image';

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
      fileInputRef.current.value = ""; // Reset file input
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
        // If there's a file but no text, use a placeholder message for history
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
      
      inputRef.current?.focus(); 
    }
  };

  const handleNewChat = () => {
    setConversationHistory([]);
    setMessage("");
    clearSelectedFile();
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
        
        {selectedFilePreview && (
          <div className="shrink-0 p-2 border-t bg-muted/50 rounded-t-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedFile?.type.startsWith("image/") ? (
                <Image src={selectedFilePreview} alt="Selected file preview" width={40} height={40} className="rounded object-cover" />
              ) : (
                <Paperclip className="h-6 w-6 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground truncate max-w-xs">{selectedFile?.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={clearSelectedFile} aria-label="Remove selected file">
              <XCircle className="h-5 w-5 text-destructive" />
            </Button>
          </div>
        )}

        <div className="mt-auto flex items-center space-x-2 pb-2 shrink-0">
          <Button variant="outline" size="icon" className="h-12 w-12 shrink-0" onClick={() => fileInputRef.current?.click()} aria-label="Attach file">
            <Paperclip size={20} />
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden"
            accept="image/*" // Restrict to images for now
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
