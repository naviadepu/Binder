import {
    BedrockRuntimeClient,
    InvokeModelCommand
  } from "@aws-sdk/client-bedrock-runtime";
  
  export async function POST(req: Request) {
    try {
      const { query } = await req.json();
  
      if (!query) {
        console.log("❌ No query received");
        return new Response(JSON.stringify({ error: 'Query is required' }), { status: 400 });
      }
  
      console.log("✅ Prompt received:", query);
  
      const client = new BedrockRuntimeClient({
        region: process.env.AWS_REGION || "us-east-2",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });
  
      const input = {
        modelId: "amazon.titan-text-lite-v1", // ✅ use your approved model ID here
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: query
            }
          ],
          max_tokens: 500
        }),
      };
  
      const command = new InvokeModelCommand(input);
      const response = await client.send(command);
      const rawBody = await response.body.transformToString();
      const json = JSON.parse(rawBody);
  
      return new Response(JSON.stringify({ reply: json.content[0].text }), {
        status: 200,
      });
  
    } catch (error: any) {
      console.error("❌ Titan G1 error:", error);
    
      // Try to parse response body if available
      if (error?.$metadata?.httpStatusCode === 400) {
        return new Response(
          JSON.stringify({
            error: "Bad request to Bedrock",
            detail: error.message,
          }),
          { status: 400 }
        );
      }
    
      return new Response(
        JSON.stringify({
          error: 'Failed to call Titan G1',
          detail: error?.message || String(error),
        }),
        { status: 500 }
      );
    }
    
  }
