import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export interface DeepSeekConfig {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  modelId?: string; // Must be an ARN
}

/**
 * Util class to call Bedrock with DeepSeek
 */
export class DeepSeek {
  private client: BedrockRuntimeClient;
  private modelId: string;

  constructor(config: DeepSeekConfig = {}) {
    const {
      region = process.env.AWS_REGION || "us-east-1",
      accessKeyId = process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY,
      modelId = "arn:aws:bedrock:us-east-1:YOUR-AWS-ID:inference-configuration/YOUR-CONFIG-NAME", // <-- Replace with your real ARN
    } = config;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("AWS credentials are required");
    }

    this.client = new BedrockRuntimeClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    this.modelId = modelId;
  }

  /**
   * Handles queries to DeepSeek via Bedrock
   */
  async query(query: string): Promise<string> {
    if (!query) {
      throw new Error("Query is required");
    }

    const command = new InvokeModelCommand({
      modelId: this.modelId, // This must be an ARN
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inferenceConfig: {
          max_tokens: 512,
          temperature: 0.7,
          top_p: 0.95,
        },
        messages: [{ role: "user", content: query }],
      }),
    });

    const response = await this.client.send(command);
    const raw = await response.body.transformToString();
    const parsed = JSON.parse(raw);
    return parsed.choices?.[0]?.message?.content ?? "";
  }
}
