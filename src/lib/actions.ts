
"use server";

import type { N8nFormData, N8nWebhookResponse, AiSuggestion } from "@/types";

const N8N_WEBHOOK_URL = "https://devwebhook.draenor.shop/webhook/input";

export async function sendDataToN8N(
  formData: N8nFormData
): Promise<{ success: boolean; data?: N8nWebhookResponse; error?: string }> {
  try {
    const n8nApiResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!n8nApiResponse.ok) {
      let errorMessage = `N8N webhook request failed with status: ${n8nApiResponse.status}`;
      try {
        const errorData = await n8nApiResponse.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) { /* Ignore if error response is not JSON */ }
      return { success: false, error: errorMessage };
    }

    const responseBodyText = await n8nApiResponse.text(); // Read body as text
    let extractedMessage: string = "";
    let parsedDataForFields: any = null; // For fields like id, status, processedAt

    try {
      const jsonData = JSON.parse(responseBodyText);
      parsedDataForFields = jsonData; 

      if (jsonData && typeof jsonData.message === 'string' && jsonData.message.trim() !== '') {
        extractedMessage = jsonData.message;
      } else if (typeof jsonData === 'string' && jsonData.trim() !== '') { 
        // Handles cases where N8N might return a string directly as JSON, e.g., "This is the response"
        extractedMessage = jsonData;
      } else if (responseBodyText.trim() !== '' && responseBodyText.trim() !== '{}' && responseBodyText.trim() !== '[]') {
        // If it's a JSON structure but doesn't have a .message field,
        // and the raw text itself is not just an empty JSON object or array,
        // use the raw response text (which would be the JSON string).
        extractedMessage = responseBodyText;
      } else {
        // Fallback if JSON is empty or doesn't fit expected structures for a message
        extractedMessage = "N8N processed the request but returned an empty or unformatted message.";
      }
    } catch (e) {
      // Not JSON, or JSON parsing failed. Use the raw text if it's not empty.
      if (responseBodyText.trim() !== '') {
        extractedMessage = responseBodyText;
      } else {
        extractedMessage = "N8N processed the request but returned an empty response.";
      }
    }
    
    const processedEntry: N8nWebhookResponse = {
      id: (parsedDataForFields?.id as string) || crypto.randomUUID(),
      receivedData: formData,
      status: (parsedDataForFields?.status as N8nWebhookResponse["status"]) || "Processed",
      processedAt: (parsedDataForFields?.processedAt as string) || new Date().toISOString(),
      message: extractedMessage,
    };

    return { success: true, data: processedEntry };

  } catch (error) {
    console.error("Error sending data to N8N:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}

// Placeholder for AI analysis function
export async function getAiWorkflowSuggestions(
  data: N8nWebhookResponse[]
): Promise<{ success: boolean; suggestions?: AiSuggestion[]; error?: string }> {
  // In a real app, this would call your Genkit flow
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (data.length === 0) {
    return { success: true, suggestions: [] };
  }
  
  const mockSuggestions: AiSuggestion[] = [
    { id: "s1", title: "Automate High-Priority Task Routing", description: "Consider creating a dedicated N8N workflow to automatically route tasks marked as 'high' priority to senior agents or a specialized queue.", category: "Automation" },
    { id: "s2", title: "Standardize Task Descriptions", description: "Encourage agents to use consistent templates for task descriptions to improve data quality and enable better automated processing.", category: "Optimization" },
    { id: "s3", title: "Batch Low-Priority Updates", description: "For 'low' priority tasks involving system updates, explore batching them to run during off-peak hours to reduce system load.", category: "Efficiency" },
  ];
  
  return { success: true, suggestions: mockSuggestions.slice(0, Math.min(mockSuggestions.length, data.length)) };
}

