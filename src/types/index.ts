export type N8nFormData = {
  agentName: string;
  taskDescription: string;
  priority: "low" | "medium" | "high";
  // Add any other fields you expect agents to send
  [key: string]: any; // Allow additional dynamic fields
};

export type N8nWebhookResponse = {
  id: string; // A unique ID for the processed item, perhaps from N8N
  receivedData: N8nFormData;
  status: "Processed" | "Error" | "Pending";
  processedAt: string; // ISO date string
  message?: string; // Optional message from N8N
  // Add any other fields N8N might return
};

export type AiSuggestion = {
  id: string;
  title: string;
  description: string;
  category: "Optimization" | "Automation" | "Efficiency";
};
