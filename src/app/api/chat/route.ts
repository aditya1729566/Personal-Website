import { buildDigitalTwinSystemPrompt } from "@/lib/digital-twin-prompt";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b:free";
const REQUEST_TIMEOUT_MS = 15000;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "OpenRouter API key is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const messages = body.messages as ChatMessage[] | undefined;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const sanitized = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-20)
      .map((m) => ({
        role: m.role,
        content: String(m.content).slice(0, 4000),
      }));

    if (sanitized.length === 0) {
      return Response.json(
        { error: "At least one valid message is required." },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Aditya Agrawal Digital Twin",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 450,
        messages: [
          { role: "system", content: buildDigitalTwinSystemPrompt() },
          ...sanitized,
        ],
      }),
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", response.status, errorText);
      return Response.json(
        { error: "Failed to get a response from the AI model." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return Response.json(
        { error: "No response content received from the model." },
        { status: 502 }
      );
    }

    return Response.json({ message: reply });
  } catch (error) {
    console.error("Chat API error:", error);
    if (error instanceof DOMException && error.name === "AbortError") {
      return Response.json(
        { error: "The assistant took too long to respond. Please try again." },
        { status: 504 }
      );
    }

    return Response.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
