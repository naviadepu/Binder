import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400 }
      );
    }

    const client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const input = {
      modelId: "amazon.titan-text-lite-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: query,
      }),
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const rawBody = await response.body.transformToString();
    const parsed = JSON.parse(rawBody); // Titan returns raw JSON string

    return new Response(
      JSON.stringify({ reply: parsed.results?.[0]?.outputText || parsed }),
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Titan call failed:", error);
    return new Response(
      JSON.stringify({
        error: "Titan call failed",
        detail: error?.message || String(error),
      }),
      { status: 500 }
    );
  }
}
