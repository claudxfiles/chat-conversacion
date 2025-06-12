
"use server";

import type { N8nFormData, N8nWebhookResponse, AiSuggestion } from "@/types";

const N8N_WEBHOOK_URL = "https://devn8n.draenor.shop/webhook-test/input";

export async function sendDataToN8N(
  formData: N8nFormData
): Promise<{ success: boolean; data?: N8nWebhookResponse; error?: string }> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      // Try to parse error message from N8N if available
      let errorMessage = `N8N webhook request failed with status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Ignore if response is not JSON
      }
      return { success: false, error: errorMessage };
    }

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = null;
    }
    
    const processedEntry: N8nWebhookResponse = {
      id: responseData?.id || crypto.randomUUID(),
      receivedData: formData,
      status: responseData?.status || "Processed",
      processedAt: responseData?.processedAt || new Date().toISOString(),
      message: responseData?.message || "Data successfully sent to N8N.",
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
