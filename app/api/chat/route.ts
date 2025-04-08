// pages/api/deepseek.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed", success: false },
      { status: 405 }
    );
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { message: "API key not configured", success: false },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required", success: false },
        { status: 400 }
      );
    }

    const deepseekResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000", // Replace with your domain in production
          "X-Title": "Your App Name", // Your app name
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free", // Or another DeepSeek model
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      }
    );

    if (!deepseekResponse.ok) {
      const errorData = await deepseekResponse.json();
      console.error("OpenRouter API Error:", errorData);
      throw new Error(`API Error: ${deepseekResponse.statusText}`);
    }

    const data = await deepseekResponse.json();
    return NextResponse.json(
      {
        success: true,
        response: data.choices[0]?.message?.content,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch response",
      },
      { status: 500 }
    );
  }
}
