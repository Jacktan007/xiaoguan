export interface DifyConfig {
  apiKey: string;
  baseUrl: string;
}

export class DifyClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: DifyConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  private async request<T>(endpoint: string, body: any): Promise<T> {
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Dify API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Dify Request Failed:', error);
      throw error;
    }
  }

  /**
   * Helper to parse potentially markdown-wrapped JSON from LLM
   */
  static parseLLMResponse(text: string): any {
    try {
      // 1. Try direct parse
      return JSON.parse(text);
    } catch (e) {
      // 2. Try extracting from ```json ... ``` or ``` ... ```
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e2) {
          console.error("Failed to parse extracted JSON block");
        }
      }
      // 3. Last resort: try to find first { and last }
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
         try {
          return JSON.parse(text.substring(firstBrace, lastBrace + 1));
        } catch (e3) {
           console.error("Failed to parse brace-enclosed JSON");
        }
      }
      
      throw new Error("Could not parse valid JSON from LLM response");
    }
  }

  async runWorkflow(inputs: Record<string, any>, user: string, files?: { type: string; url: string }[]) {
    return this.request('/workflows/run', {
      inputs,
      response_mode: 'blocking',
      user,
      files
    });
  }
  
  async runChatMessage(query: string, inputs: Record<string, any>, user: string, conversationId?: string) {
    return this.request('/chat-messages', {
        query,
        inputs,
        response_mode: 'blocking',
        user,
        conversation_id: conversationId
    });
  }
}

export const difyClient = new DifyClient({
  apiKey: process.env.DIFY_API_KEY || 'mock-key',
  baseUrl: process.env.DIFY_API_URL || 'https://api.dify.ai/v1',
});
