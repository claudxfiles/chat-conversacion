
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

    const responseBodyText = await n8nApiResponse.text();
    let extractedMessage: string = "";
    const defaultBotMessage = "Bot: Sorry, I couldn't get a clear response from the assistant.";
    let parsedDataForFields: any = null;

    try {
      parsedDataForFields = JSON.parse(responseBodyText);

      if (parsedDataForFields && typeof parsedDataForFields.message === 'string' && parsedDataForFields.message.trim() !== '') {
        // Case 1: Ideal - N8N returns {"message": "response text"}
        extractedMessage = parsedDataForFields.message;
      } else if (typeof parsedDataForFields === 'string' && parsedDataForFields.trim() !== '') {
        // Case 2: N8N returns "response text" (as a JSON string literal)
        extractedMessage = parsedDataForFields;
      } else if (typeof parsedDataForFields === 'object' && parsedDataForFields !== null && !Array.isArray(parsedDataForFields)) {
        // Case 3: N8N returns a JSON object, not in the ideal format.
        const keys = Object.keys(parsedDataForFields);
        if (keys.length === 1 && typeof parsedDataForFields[keys[0]] === 'string' && (parsedDataForFields[keys[0]] as string).trim() !== '') {
          // Heuristic: if {"someKey": "response text"}, use "response text"
          extractedMessage = parsedDataForFields[keys[0]];
        } else {
          // Try to find any top-level non-empty string value as a last resort for an object.
          let foundText = "";
          for (const key of keys) {
            if (typeof parsedDataForFields[key] === 'string' && (parsedDataForFields[key] as string).trim() !== '') {
              foundText = parsedDataForFields[key] as string;
              break; // Take the first non-empty string value found
            }
          }
          if (foundText) {
            extractedMessage = foundText;
          } else {
            extractedMessage = "Bot: Assistant returned structured data. Please ensure N8N workflow outputs a simple text response or a JSON with a 'message' field.";
          }
        }
      } else if (typeof parsedDataForFields === 'number' || typeof parsedDataForFields === 'boolean') {
        // Case 4: N8N returns a number or boolean as JSON (e.g. 123, true)
        extractedMessage = String(parsedDataForFields);
      } else if (Array.isArray(parsedDataForFields)) {
        // Case 5: N8N returns a JSON array.
        extractedMessage = "Bot: Assistant returned an array. Please ensure N8N workflow outputs simple text or a JSON with a 'message' field.";
      } else if (responseBodyText.trim() === '' || responseBodyText.trim() === '{}' || responseBodyText.trim() === '[]') {
         // Case 6: The raw response was empty or an empty JSON structure
        extractedMessage = "Bot: Assistant gave an empty response.";
      } else {
        // Case 7: Fallback for other unhandled valid JSON types (e.g. null if JSON.parse('null')) or if logic missed something.
        extractedMessage = defaultBotMessage;
      }
    } catch (e) {
      // Case 8: Not JSON, or JSON parsing failed. Assume plain text.
      if (responseBodyText.trim() !== '') {
        extractedMessage = responseBodyText;
      } else {
        // If parsing failed and body is empty, it's an empty response.
        extractedMessage = "Bot: Assistant gave an empty response.";
      }
    }

    // Ensure extractedMessage is not purely whitespace, if it is after all logic, use a default.
    if (extractedMessage.trim() === '') {
        extractedMessage = defaultBotMessage;
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

