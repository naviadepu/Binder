import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: "AKIAQHDBB5L3D622XPGR",
    secretAccessKey: "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",
  },
});

const modelId = "deepseek.r1-v1:0";
const prompt = "Tell me a cool fact about the ocean.";
const formattedPrompt = `<｜begin▁of▁sentence｜><｜User｜>${prompt}<｜Assistant｜><think>\n`;

const run = async () => {
  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: formattedPrompt,
      max_tokens: 512,
      temperature: 0.5,
      top_p: 0.9,
    }),
  });

  try {
    const response = await client.send(command);
    const raw = await response.body.transformToString();
    const output = JSON.parse(raw);

    console.log("✅ DeepSeek says:\n", output.choices?.[0]?.text ?? raw);
  } catch (error) {
    console.error("❌ DeepSeek error:\n", error);
  }
};

run();
