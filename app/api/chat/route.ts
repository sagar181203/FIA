import { NextRequest, NextResponse } from "next/server";

const AI_PROVIDER  = process.env.AI_PROVIDER  || "google";
const OLLAMA_URL   = process.env.OLLAMA_URL   || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "fia-slm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, system, model } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    if (AI_PROVIDER === "google")    return handleGoogle(messages, system);
    if (AI_PROVIDER === "ollama")    return handleOllama(messages, system);
    if (AI_PROVIDER === "groq")      return handleGroq(messages, system);
    if (AI_PROVIDER === "anthropic") return handleAnthropic(messages, system);

    return NextResponse.json({ error: "Set AI_PROVIDER in .env.local" }, { status: 500 });
  } catch (e) {
    console.error("Chat error:", e);
    return NextResponse.json({ error: "Request failed", details: String(e) }, { status: 500 });
  }
}

async function handleGoogle(messages: any[], system: string) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GOOGLE_GEMINI_API_KEY not set in .env.local" }, { status: 500 });
  return NextResponse.json({ content: [{ text: "⚠️ Google Gemini API has quota issues. Switch to Groq in .env.local: AI_PROVIDER=groq" }] });
}

async function handleOllama(messages: any[], system: string) {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        options: { temperature: 0.7, num_predict: 1024 },
        messages: [
          { role: "system", content: system },
          ...messages.map((m: any) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content || m.text })),
        ],
      }),
    });
    if (!res.ok) return NextResponse.json({ content: [{ text: "⚠️ Ollama not running. Run: `ollama serve` in terminal, then `ollama run fia-slm`" }] });
    const data = await res.json();
    return NextResponse.json({ content: [{ text: data.message?.content || "No response" }] });
  } catch (e) {
    console.error("Ollama error:", e);
    return NextResponse.json({ content: [{ text: "⚠️ Cannot connect to Ollama. Make sure it's running on port 11434." }] });
  }
}

async function handleGroq(messages: any[], system: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GROQ_API_KEY not set in .env.local" }, { status: 500 });
  
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 1024,
        temperature: 0.7,
        messages: [
          { role: "system", content: system },
          ...messages.map((m: any) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content || m.text })),
        ],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Groq error:", data);
      return NextResponse.json({ content: [{ text: `⚠️ Groq API Error: ${data.error?.message || "Unknown"}` }] });
    }
    return NextResponse.json({ content: [{ text: data.choices?.[0]?.message?.content || "No response" }] });
  } catch (e) {
    console.error("Groq handler error:", e);
    return NextResponse.json({ content: [{ text: "⚠️ Cannot connect to Groq API." }] });
  }
}

async function handleAnthropic(messages: any[], system: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set in .env.local" }, { status: 500 });
  
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system,
        messages: messages.map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content || m.text
        })),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Anthropic error:", data);
      return NextResponse.json({ content: [{ text: `⚠️ Anthropic API Error: ${data.error?.message || "Unknown"}` }] });
    }
    const reply = data.content?.[0]?.text || "No response";
    return NextResponse.json({ content: [{ text: reply }] });
  } catch (e) {
    console.error("Anthropic handler error:", e);
    return NextResponse.json({ content: [{ text: "⚠️ Cannot connect to Anthropic API." }] });
  }
}
