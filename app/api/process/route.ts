import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

interface ProcessRequest {
  type: 'text' | 'url' | 'file' | 'video';
  content: string | File;
}

async function summarizeText(text: string) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }
  // console.log('text')
  // console.log(text)

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': SITE_URL || 'http://localhost:3000',
        'X-Title': SITE_NAME || 'AI Content Summarizer',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes content. Provide concise, informative summaries that capture the key points. Format the summary with clear sections and bullet points where appropriate.'
          },
          {
            role: 'user',
            content: `Please analyze and summarize the following content. Focus on the main ideas, key points, and important details. If there are any notable quotes or statistics, include them. Here's the content:\n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to summarize content');
    }

    const data = await response.json();
    console.log('data')
    console.log(data)
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    return {
      summary: data.choices[0].message.content,
      taskId: `task_${Date.now()}`,
      status: 'completed'
    };
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
}

async function processVideo(videoUrl: string) {
  // TODO: 实现视频处理逻辑
  return {
    taskId: `video_${Date.now()}`,
    status: 'processing',
    message: 'Video processing started'
  };
}

export async function POST(request: Request) {
  try {
    const body: ProcessRequest = await request.json();
    const { type, content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'text':
        if (typeof content !== 'string') {
          return NextResponse.json(
            { error: 'Text content must be a string' },
            { status: 400 }
          );
        }
        result = await summarizeText(content);
        // console.log('result')
        // console.log(result)
        break;
      case 'url':
        if (typeof content !== 'string') {
          return NextResponse.json(
            { error: 'URL must be a string' },
            { status: 400 }
          );
        }
        // TODO: 实现 URL 内容抓取
        result = {
          taskId: `url_${Date.now()}`,
          status: 'processing',
          message: 'URL processing started'
        };
        break;
      case 'file':
        // TODO: 实现文件处理
        result = {
          taskId: `file_${Date.now()}`,
          status: 'processing',
          message: 'File processing started'
        };
        break;
      case 'video':
        if (typeof content !== 'string') {
          return NextResponse.json(
            { error: 'Video URL must be a string' },
            { status: 400 }
          );
        }
        result = await processVideo(content);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        status: 'error'
      },
      { status: 500 }
    );
  }
} 