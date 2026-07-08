import { buildDigitalTwinSystemPrompt } from "@/lib/digital-twin-prompt";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODELS = [
  "openai/gpt-oss-20b:free",
  "openai/gpt-oss-120b:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];
const REQUEST_TIMEOUT_MS = 30000;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenRouterError = {
  status: number;
  body: string;
  model: string;
};

function getModelCandidates() {
  const configured = [
    process.env.OPENROUTER_MODEL,
    process.env.OPENROUTER_FALLBACK_MODELS,
  ]
    .filter(Boolean)
    .flatMap((models) => models!.split(","))
    .map((model) => model.trim())
    .filter(Boolean);

  return Array.from(new Set([...configured, ...DEFAULT_MODELS]));
}

function shouldTryNextModel(status: number) {
  return status === 408 || status === 409 || status === 429 || status >= 500;
}

function getClientErrorMessage(errors: OpenRouterError[]) {
  if (errors.every((error) => error.status === 429)) {
    return "The AI providers are temporarily rate-limited. Please try again in a minute.";
  }

  return "Failed to get a response from the AI model.";
}

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

    const modelCandidates = getModelCandidates();
    const upstreamErrors: OpenRouterError[] = [];

    for (const model of modelCandidates) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
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
            model,
            temperature: 0.2,
            max_tokens: 450,
            messages: [
              { role: "system", content: buildDigitalTwinSystemPrompt() },
              ...sanitized,
            ],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          upstreamErrors.push({ status: response.status, body: errorText, model });
          console.error("OpenRouter error:", response.status, model, errorText);

          if (shouldTryNextModel(response.status)) {
            continue;
          }

          return Response.json(
            { error: "Failed to get a response from the AI model." },
            { status: response.status }
          );
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;

        if (!reply) {
          upstreamErrors.push({
            status: 502,
            body: "No response content received from the model.",
            model,
          });
          console.error("OpenRouter empty response:", model, data);
          continue;
        }

        return Response.json({ message: reply });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          upstreamErrors.push({
            status: 504,
            body: "OpenRouter request timed out.",
            model,
          });
          console.error("OpenRouter timeout:", model);
          continue;
        }

        throw error;
      } finally {
        clearTimeout(timeout);
      }
    }

    return Response.json(
      { error: getClientErrorMessage(upstreamErrors) },
      { status: upstreamErrors.every((error) => error.status === 429) ? 429 : 503 }
    );
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
