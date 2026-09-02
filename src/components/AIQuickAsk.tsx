"use client";

import { useState } from "react";
import { Sparkles, Send, Bot, CheckCircle2, ArrowRight } from "lucide-react";
import type { InsightsData } from "@/lib/ai-categorizer";

interface AIQuickAskProps {
  insightsData: InsightsData | null;
}

export default function AIQuickAsk({ insightsData }: AIQuickAskProps) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const presetPrompts = [
    "Analyze food & dining expenses",
    "Where can I save ₹2,000 this month?",
    "Show largest spending categories",
    "Calculate my daily spending average",
  ];

  const handleAsk = (userPrompt: string) => {
    if (!userPrompt.trim()) return;
    setLoading(true);
    setAnswer(null);

    setTimeout(() => {
      const q = userPrompt.toLowerCase();
      let response = "";

      if (q.includes("food") || q.includes("dining")) {
        const foodCat = insightsData?.categoryBreakdown.find(
          (c) => c.category === "Food & Dining"
        );
        if (foodCat) {
          response = `🍔 Food & Dining is currently your ${
            foodCat.percentage > 30 ? "largest" : "active"
          } category at ₹${foodCat.amount.toLocaleString()} (${foodCat.percentage}% of total). Recommendation: Preparing 2 home meals per week could save ~₹1,500/month.`;
        } else {
          response = "🍔 You have 0 logged Food & Dining expenses this month. Great control!";
        }
      } else if (q.includes("save") || q.includes("saving") || q.includes("2,000") || q.includes("2000")) {
        const top = insightsData?.topCategory || "Shopping";
        response = `💡 Potential Savings Target: Reducing non-essential spending in ${top} by 15% can free up approx ₹${
          Math.round((insightsData?.totalSpent || 5000) * 0.15).toLocaleString()
        } this month!`;
      } else if (q.includes("largest") || q.includes("top") || q.includes("categories")) {
        const top3 = insightsData?.categoryBreakdown.slice(0, 3) || [];
        if (top3.length > 0) {
          response = `📊 Top Spending Categories: ${top3
            .map((c) => `${c.category} (₹${c.amount.toLocaleString()} - ${c.percentage}%)`)
            .join(", ")}.`;
        } else {
          response = "📊 Log a few more expenses to reveal your top spending categories!";
        }
      } else if (q.includes("daily") || q.includes("average")) {
        const avg = insightsData?.averageTransaction || 0;
        const total = insightsData?.totalSpent || 0;
        const count = insightsData?.transactionCount || 0;
        response = `📈 Spending Summary: You've made ${count} total transactions averaging ₹${avg.toLocaleString()} per transaction. Total logged: ₹${total.toLocaleString()}.`;
      } else {
        response = `✨ AI Copilot Analysis: Based on your ${
          insightsData?.transactionCount || 0
        } transactions totaling ₹${(
          insightsData?.totalSpent || 0
        ).toLocaleString()}, your top category is "${
          insightsData?.topCategory || "General"
        }". Keeping recurring items under control will maintain high financial health.`;
      }

      setAnswer(response);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="ai-assistant-card">
      <div className="ai-assistant-header">
        <div className="ai-assistant-title">
          <Bot size={22} style={{ color: "#818cf8" }} />
          <span>AI Financial Copilot</span>
        </div>
        <div
          className="ai-badge"
          style={{ background: "rgba(255,255,255,0.15)", color: "#ffffff", borderColor: "rgba(255,255,255,0.2)" }}
        >
          <Sparkles size={11} />
          Active Engine
        </div>
      </div>

      <p style={{ fontSize: "0.875rem", color: "#cbd5e1", lineHeight: 1.5 }}>
        Ask any question about your spending habits, budget limits, or savings targets.
      </p>

      {/* Preset Prompts */}
      <div className="ai-prompt-pills">
        {presetPrompts.map((prompt) => (
          <button
            key={prompt}
            className="ai-prompt-pill"
            onClick={() => {
              setQuery(prompt);
              handleAsk(prompt);
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(query);
        }}
        style={{ display: "flex", gap: 8, marginTop: 14 }}
      >
        <input
          type="text"
          className="form-input"
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#ffffff",
          }}
          placeholder="Ask AI: 'Where did most of my money go?'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !query.trim()}
          style={{ padding: "0 18px" }}
        >
          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>

      {/* AI Response Display */}
      {answer && (
        <div className="ai-answer-box">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#a5b4fc",
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <CheckCircle2 size={13} /> AI Insights Response
          </div>
          {answer}
        </div>
      )}
    </div>
  );
}
