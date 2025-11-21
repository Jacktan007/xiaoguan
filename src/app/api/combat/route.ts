import { NextResponse } from 'next/server';
import { CombatRequest, CombatResponse, TacticalCardData } from '@/types';
import { DifyClient, difyClient } from '@/lib/dify';

// Initialize Dify Client for Combat App
// Note: You might want a separate client instance if keys differ
const combatClient = new DifyClient({
    apiKey: process.env.DIFY_API_KEY_COMBAT || 'mock-key',
    baseUrl: process.env.DIFY_API_URL || 'https://api.dify.ai/v1'
});

export async function POST(request: Request) {
  try {
    const body: CombatRequest = await request.json();
    const { 
        industry, productName, role, 
        stage, triggerValue, problemType, 
        query, conversationId, userId 
    } = body;

    // Construct inputs for Dify
    const inputs = {
        industry,
        product_name: productName,
        role,
        stage,
        problem_type: problemType,
        trigger_value: triggerValue // Pass this if prompt uses it
    };

    // Determine query text
    // If manual query exists, use it. Otherwise, use a predefined trigger prompt
    const queryText = query || `[System Trigger] Stage: ${stage}, Problem: ${problemType}`;

    console.log("Calling Dify Combat API:", { inputs, query: queryText });

    // Call Dify Chat API
    const difyRes = await combatClient.runChatMessage(
        queryText,
        inputs,
        userId || 'user-default',
        conversationId
    ) as any;
    
    // Extract and Parse Answer
    const rawAnswer = difyRes.answer || '';
    console.log("Dify Raw Answer:", rawAnswer);

    let parsedData: TacticalCardData;
    try {
        parsedData = DifyClient.parseLLMResponse(rawAnswer);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        // Fallback for unstructured response
        parsedData = {
            diagnosis: "无法解析 AI 响应格式",
            tags: ["#Error"],
            scripts: [{ type: 'soft', content: rawAnswer.substring(0, 100) + "..." }],
            warning: "系统正在调整，请稍后重试",
            files: []
        };
    }

    const response: CombatResponse = {
        ...parsedData,
        // Return conversation_id so client can persist it
        // conversation_id is usually in difyRes.conversation_id
        // We might need to extend CombatResponse type if we want to pass it back explicitly,
        // but usually it's handled by the client seeing the ID unchanged or new.
    };

    return NextResponse.json({
        data: response,
        conversation_id: difyRes.conversation_id
    });

  } catch (error) {
    console.error("Combat API Error:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
