"use client";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import ReactMarkdown from "react-markdown";

const QUICK_Q = [
  "How much tax will I pay?",
  "Budget for rent & food?",
  "How much to save for health?",
  "Suggest SIP amount",
  "How to save more tax?",
  "Emergency fund needed?",
  "Annual vs monthly savings?",
];

export default function ChatPage() {
  const { profile: p, sliders, messages, addMsg } = useStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendChat() {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    addMsg({ role: "user", text: userText });
    setLoading(true);

    const sys = `You are FIA (Finance Intelligent Assistant), an AI CA for Indian users (FY 2024-25).
User: Salary ₹${p.salary||"?"}/yr | Monthly ₹${p.monthlyIncome} | Expenses ₹${p.monthlyExpenses} | Tax: ${p.regime} | Age: ${p.age||"?"} | Risk: ${p.riskAppetite} | Loans: ₹${p.loans}
Budget: ${sliders.map(s=>`${s.label} ${s.pct}%`).join(", ")}
Rules: be concise & accurate; use ₹; step-by-step for tax; health min ₹5000/mo; emergency fund = 6× monthly expenses; add disclaimer for official tax/legal advice. Use markdown formatting.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: sys,
          messages: [
            ...messages.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })),
            { role: "user", content: userText },
          ],
        }),
      });
      const data = await res.json();
      const reply = data.content?.map((c: any) => c.text || "").join("") || "Sorry, something went wrong.";
      addMsg({ role: "ai", text: reply });
    } catch {
      addMsg({ role: "ai", text: "⚠️ Connection error. Please check your internet and try again." });
    }
    setLoading(false);
  }

  return (
    <div className="chat-screen">

      {/* Quick question pills */}
      <div
        className="flex gap-2 px-3 py-2 border-b border-border flex-shrink-0 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {QUICK_Q.map(q => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="flex-shrink-0 text-[11px] font-medium bg-s2 border border-border text-text px-3 py-1.5 rounded-full whitespace-nowrap transition-colors active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="chat-messages p-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 items-end slide-up ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {m.role === "ai" && (
              <div className="w-7 h-7 rounded-full bg-s2 border border-border flex items-center justify-center text-sm flex-shrink-0">🤖</div>
            )}
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-sm text-white"
                  : "bg-s1 border border-border rounded-bl-sm text-text"
              }`}
              style={m.role === "user" ? { background: "linear-gradient(135deg,#5b5ef4,#818cf8)" } : {}}
            >
              {m.role === "user" ? (
                <p>{m.text}</p>
              ) : (
                <ReactMarkdown
                  components={{
                    p:          ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong:     ({ children }) => <strong className="font-bold text-accent">{children}</strong>,
                    em:         ({ children }) => <em className="italic opacity-80">{children}</em>,
                    h1:         ({ children }) => <h1 className="text-[15px] font-extrabold text-accent mb-2 mt-2">{children}</h1>,
                    h2:         ({ children }) => <h2 className="text-[14px] font-bold text-accent mb-1.5 mt-2">{children}</h2>,
                    h3:         ({ children }) => <h3 className="text-[13px] font-bold text-accent mb-1 mt-1.5">{children}</h3>,
                    ul:         ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol:         ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    li:         ({ children }) => <li className="text-[13px] leading-relaxed">{children}</li>,
                    code:       ({ children, className }) => {
                      const isBlock = className?.includes("language-");
                      return isBlock
                        ? <code className="block bg-s2 border border-border rounded-lg p-3 text-[12px] font-mono overflow-x-auto my-2">{children}</code>
                        : <code className="bg-accent/10 text-accent px-1.5 py-0.5 rounded text-[12px] font-mono">{children}</code>;
                    },
                    hr:         () => <hr className="border-border my-3" />,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-accent pl-3 italic opacity-80 my-2">{children}</blockquote>
                    ),
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-end slide-up">
            <div className="w-7 h-7 rounded-full bg-s2 border border-border flex items-center justify-center text-sm flex-shrink-0">🤖</div>
            <div className="bg-s1 border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-muted text-[13px]">FIA is thinking</span>
                <span className="dot-anim text-accent font-bold text-lg leading-none">.</span>
                <span className="dot-anim text-accent font-bold text-lg leading-none">.</span>
                <span className="dot-anim text-accent font-bold text-lg leading-none">.</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 border-t border-border p-3 pb-2" style={{ background: "rgba(6,11,24,0.97)" }}>
        <div className="flex gap-2">
          <input
            className="flex-1 bg-s2 border border-border rounded-xl px-4 py-2.5 text-text text-[13px] outline-none focus:border-accent transition-colors placeholder:text-muted"
            placeholder="Ask FIA about tax, budget, SIP..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
          />
          <button
            onClick={sendChat}
            disabled={loading}
            className="px-4 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#5b5ef4,#818cf8)" }}
          >
            ➤
          </button>
        </div>
        <p className="text-center text-[10px] text-muted mt-1.5">
          ⚠️ AI guidance only. Consult a certified CA for official filing.
        </p>
      </div>
    </div>
  );
}
