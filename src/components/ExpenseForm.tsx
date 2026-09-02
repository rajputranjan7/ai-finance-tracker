"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/ai-categorizer";
import {
  DollarSign,
  FileText,
  Calendar,
  Sparkles,
  Plus,
} from "lucide-react";

interface ExpenseFormProps {
  onExpenseAdded: () => void;
}

export default function ExpenseForm({ onExpenseAdded }: ExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const supabase = createClient();

  const handleDescriptionBlur = async () => {
    if (!description.trim()) return;
    setAiSuggesting(true);
    try {
      const res = await fetch("/api/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (data.category) {
        setCategory(data.category);
      }
    } catch {
      // Silently fail — user can still pick a category manually
    } finally {
      setAiSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description.trim()) return;
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const finalCategory = category || "Other";

      const { error } = await supabase.from("expenses").insert({
        user_id: user.id,
        amount: parseFloat(amount),
        description: description.trim(),
        category: finalCategory,
        ai_category: finalCategory,
        expense_date: date,
      });

      if (error) throw error;

      // Reset form
      setAmount("");
      setDescription("");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
      onExpenseAdded();
    } catch (err) {
      console.error("Failed to add expense:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Log Expense</h2>
          <p className="card-subtitle">AI auto-categorizes your entries</p>
        </div>
        <div className="ai-badge">
          <Sparkles size={10} />
          AI Enabled
        </div>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="expense-form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="expense-amount">
              Amount (₹)
            </label>
            <div className="form-input-with-icon">
              <DollarSign size={16} className="form-input-icon" />
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="expense-date">
              Date
            </label>
            <div className="form-input-with-icon">
              <Calendar size={16} className="form-input-icon" />
              <input
                id="expense-date"
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="expense-description">
            Description
          </label>
          <div className="form-input-with-icon">
            <FileText size={16} className="form-input-icon" />
            <input
              id="expense-description"
              type="text"
              className="form-input"
              placeholder="e.g. Lunch at restaurant, Uber ride..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="expense-category">
            Category
            {aiSuggesting && (
              <span className="ai-badge" style={{ marginLeft: 8 }}>
                <div className="loading-spinner" style={{ width: 10, height: 10 }} />
                Analyzing...
              </span>
            )}
            {category && !aiSuggesting && (
              <span className="ai-badge" style={{ marginLeft: 8 }}>
                <Sparkles size={10} />
                AI Suggested
              </span>
            )}
          </label>
          <select
            id="expense-category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !amount || !description.trim()}
          style={{ width: "100%", marginTop: 4 }}
        >
          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <>
              <Plus size={16} />
              Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
}
