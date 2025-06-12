export type N8nFormData = {
  agentName?: string; // Made optional
  taskDescription: string; // This will be the user's message
  priority?: "low" | "medium" | "high"; // Made optional
  // Add any other fields you expect agents to send
  [key: string]: any; // Allow additional dynamic fields
};

export type N8nWebhookResponse = {
  id: string; // A unique ID for the processed item, perhaps from N8N
  receivedData: N8nFormData; // This will now hold the potentially simplified data
  status: "Processed" | "Error" | "Pending";
  processedAt: string; // ISO date string
  message?: string; // Optional message from N8N (expected to be the AI's reply for conversation)
  // Add any other fields N8N might return
};

export type AiSuggestion = {
  id: string;
  title: string;
  description: string;
  category: "Optimization" | "Automation" | "Efficiency";
};
