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
      modelId: "deepseek.r1-v1:0", // ✅ DeepSeek R1
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: query,
          },
        ],
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.95,
      }),
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const rawBody = await response.body.transformToString();
    console.log("🧪 DeepSeek raw response:\n", rawBody);

    const parsed = JSON.parse(rawBody);
    const reply = parsed.choices?.[0]?.message?.content || "No response";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("❌ DeepSeek call failed:", error);
    return new Response(
      JSON.stringify({
        error: "DeepSeek call failed",
        detail: error?.message || String(error),
      }),
      { status: 500 }
    );
  }
}
