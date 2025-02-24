import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

// 检查环境变量
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

// 创建代理agent
const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:7890');

// 自定义fetch函数
const customFetch = (url: string, options = {}) => {
  return fetch(url, {
    ...options,
    agent: proxyAgent,
  });
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
  timeout: 60000,
  maxRetries: 3,
  fetch: customFetch as any,
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

    // 添加代理相关的错误处理
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Could not connect to proxy - Please check your proxy settings' },
        { status: 502 }
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