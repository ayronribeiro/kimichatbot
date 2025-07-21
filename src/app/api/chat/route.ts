import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'OpenRouter API key not configured.' }, { status: 500 });
  }

  const payload = {
    model: 'moonshotai/kimi-k2:free',
    messages: [
      { role: 'user', content: message },
    ],
  };

  try {
    const kimiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Kimi',
      },
      body: JSON.stringify(payload),
    });

    const data = await kimiRes.json();
    if (!kimiRes.ok) {
      const { error } = data;
      return NextResponse.json({
        choices: [
          {
            message: {
              content: `❌ **OpenRouter error**: ${error?.message || 'Unknown provider error'}`,
            },
          },
        ],
      }, { status: 200 });
    }
    if (!data.choices || !data.choices[0]?.message?.content) {
      return NextResponse.json({ choices: [{ message: { content: data.error?.message || 'Sorry, I could not get a response from the AI.' } }] }, { status: 200 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ choices: [{ message: { content: 'Error connecting to the AI.' } }] }, { status: 200 });
  }
} 