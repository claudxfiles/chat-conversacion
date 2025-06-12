"use client";

import type { N8nFormData, N8nWebhookResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sendDataToN8N } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  agentName: z.string().min(2, {
    message: "Agent name must be at least 2 characters.",
  }),
  taskDescription: z.string().min(10, {
    message: "Task description must be at least 10 characters.",
  }),
  priority: z.enum(["low", "medium", "high"]),
  // Example of an optional dynamic field:
  // customField: z.string().optional(), 
});

type N8nFormProps = {
  onDataProcessed: (data: N8nWebhookResponse) => void;
};

export function N8nForm({ onDataProcessed }: N8nFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentName: "",
      taskDescription: "",
      priority: "medium",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const result = await sendDataToN8N(values as N8nFormData);
    setIsSubmitting(false);

    if (result.success && result.data) {
      toast({
        title: "Success!",
        description: result.data.message || "Data sent to N8N successfully.",
      });
      onDataProcessed(result.data);
      form.reset(); // Reset form after successful submission
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to send data to N8N.",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Send Data to N8N</CardTitle>
        <CardDescription>Fill out the form below to submit data to your N8N workflow.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter agent name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taskDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the task or data to be sent"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Example for adding a dynamic field input if needed in future
            <FormField
              control={form.control}
              name="customField" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Field (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter custom data" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            */}
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send Data
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
