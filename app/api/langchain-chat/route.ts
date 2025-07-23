import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Debug: Check API key
    if (!process.env.CHUTES_API_TOKEN) {
      console.error('CHUTES_API_TOKEN is missing');
      return NextResponse.json({ error: 'CHUTES_API_TOKEN is missing' }, { status: 500 });
    }

    // Debug: Log request body
    const body = await req.json();
    console.debug('Request body:', body);
    const { message } = body;
    if (!message) {
      console.error('No message provided in request body');
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    // Prepare payload for DeepSeek API
    const payload = {
      model: 'deepseek-ai/DeepSeek-R1',
      messages: [
        { role: 'user', content: message },
      ],
      stream: false,
      max_tokens: 1024,
      temperature: 0.7,
    };

    // Make the API call
    const response = await fetch('https://llm.chutes.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHUTES_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', errorText);
      return NextResponse.json({ error: `DeepSeek API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    // DeepSeek returns choices[0].message.content
    const aiResponse = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in /api/langchain-chat:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}