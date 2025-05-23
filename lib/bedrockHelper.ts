import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export interface DeepSeekConfig {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  modelId?: string;
}

/**
 * Util class to call bedrock
 */
export class DeepSeek {
  private client: BedrockRuntimeClient;
  private modelId: string;

  constructor(config: DeepSeekConfig = {}) {
    const {
      region = process.env.AWS_REGION || "us-east-1",
      accessKeyId = process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY,
      modelId = "deepseek.r1-v1:0",
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
   * handles queries to bedrock models
   */
  async query(query: string) {
    if (!query) {
      throw new Error("Query is required");
    }

    const command = new InvokeModelCommand({
      modelId: this.modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [{ role: "user", content: query }],
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.95,
      }),
    });

    const response = await this.client.send(command);
    const raw = await response.body.transformToString();
    const parsed = JSON.parse(raw);
    return parsed.choices?.[0]?.message?.content ?? "";
  }
}
