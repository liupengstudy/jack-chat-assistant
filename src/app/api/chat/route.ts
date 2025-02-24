import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// 检查环境变量
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
  timeout: 60000,
  maxRetries: 3,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    console.log('Sending request to OpenAI with messages:', messages);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log('Received response from OpenAI:', response.choices[0].message);

    if (!response.choices[0].message.content) {
      throw new Error('Empty response from OpenAI');
    }

    return NextResponse.json({
      content: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    // 更详细的错误处理
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { error: 'Request timeout - Please try again' },
        { status: 408 }
      );
    }
    
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded - Please try again later' },
        { status: 429 }
      );
    }

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key - Please check your configuration' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
} 