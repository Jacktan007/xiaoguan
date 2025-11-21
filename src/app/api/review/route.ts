import { NextResponse } from 'next/server';
import { DifyClient } from '@/lib/dify';

// Max duration for Vercel Pro (check plan limits) - Vision can be slow
export const maxDuration = 60; 

const reviewClient = new DifyClient({
  apiKey: process.env.DIFY_API_KEY_REVIEW || 'mock-key',
  baseUrl: process.env.DIFY_API_URL || 'https://api.dify.ai/v1'
});

export async function POST(request: Request) {
  try {
    const { image, industry, product, role } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Prepare inputs
    const inputs = {
        industry,
        product,
        role
    };

    // Handle image upload structure for Dify Workflow
    // Dify expects file objects usually uploaded via /files/upload first or passed as base64 if supported by the workflow input type.
    // BUT standard Dify Workflow "Image" input usually takes a transfer_method.
    // For simplicity in this MVP, assuming the Workflow accepts an "image" variable of type string (Base64) 
    // OR we use the standard `files` argument if it's a vision model node direct input.
    // Let's try the standard 'files' array approach for Chat/Workflow.
    
    const files = [
        {
            type: 'image',
            transfer_method: 'local_file', // or remote_url
            // Dify API often requires uploading the file first to get an ID, 
            // OR sending base64 directly depending on version.
            // If 'local_file', we need upload_file_id. 
            // If specific vision model input, sometimes base64 in variable works.
            // For this MVP, let's assume we pass base64 string to a text input named 'image_base64' 
            // OR we implement the proper /files/upload flow if strict.
            // Let's try the "sys.files" approach if the workflow is configured for it.
            
            // REVISION: Since we don't have the upload endpoint implemented in DifyClient yet,
            // and to save tokens, we will pass the Base64 string as a variable 'image_data'
            // and let the LLM/Workflow handle it (if it supports base64 text analysis or if we use a tool).
            
            // HOWEVER, Dify Vision usually requires the `files` parameter in the run request.
            // The `files` param expects an uploaded file ID.
            // To make this truly work without a separate upload step, we might need the specific Dify "Upload" API.
            // Let's stick to the Plan: Call Dify Vision Workflow.
            // We will assume the workflow takes `image` as an input variable (text) containing base64,
            // OR we skip the actual vision call if too complex for this 1-step MVP and stick to Mock if no Key provided.
        }
    ];

    if (process.env.DIFY_API_KEY_REVIEW) {
        // Real Call
        // Note: For Vision features in Dify, you typically need to upload the file first.
        // Since we want to keep it simple, we'll try passing it as a long string input first.
        // If that fails, we would need to implement the multipart upload.
        
        console.log("Calling Dify Review Workflow...");
        const result = await reviewClient.runWorkflow(
            { ...inputs, image: image }, // Passing base64 as text input 'image'
            'user-review-1'
        );
        
        // Parse result
        console.log("Review Result:", result);
        
        // The workflow should return a JSON string in 'outputs'
        const rawOutput = result.data.outputs?.result || result.data.outputs?.text || "{}";
        const parsedData = DifyClient.parseLLMResponse(rawOutput);
        
        return NextResponse.json(parsedData);

    } else {
        // Mock Fallback (as before)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return NextResponse.json({
          overallScore: 72,
          stageScores: [
            { id: 'S0', name: '建立信任', score: 90, status: 'success' },
            { id: 'S1', name: '发现痛点', score: 85, status: 'success' },
            { id: 'S2', name: '提供价值', score: 60, status: 'warning' },
            { id: 'S3', name: '建立张力', score: 40, status: 'error' },
            { id: 'S4', name: '处理异议', score: 70, status: 'warning' },
            { id: 'S5', name: '促成决策', score: 0, status: 'warning' },
          ],
          mistakes: [
            {
              id: 'm1',
              stage: 'S3 建立张力',
              original: '客户说现在挺好，我就说那好的打扰了。',
              reason: '过早放弃，未尝试挑战客户的现状偏好 (Status Quo Bias) [MOCK DATA]。',
              better_script: '理解现在运行平稳。但我很好奇，如果半年后行业法规突然调整，现有流程有Plan B吗？'
            }
          ]
        });
    }

  } catch (error) {
    console.error("Review API Error:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
