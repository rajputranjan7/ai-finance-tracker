"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/ai-categorizer";
import { expenseSchema } from "@/lib/validation";
import {
  DollarSign,
  FileText,
  Calendar,
  Sparkles,
  Plus,
  AlertCircle,
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
  const [errorMsg, setErrorMsg] = useState("");
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
      // Continue
    } finally {
      setAiSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const parsedAmount = parseFloat(amount);
    const finalCategory = category || "Other";

    // Zod validation
    const validation = expenseSchema.safeParse({
      amount: parsedAmount,
      description: description.trim(),
      category: finalCategory,
      expense_date: date,
    });

    if (!validation.success) {
      const msg = validation.error.issues[0]?.message || "Invalid input";
      setErrorMsg(msg);
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setErrorMsg("User not authenticated.");
        return;
      }

      const { error } = await supabase.from("expenses").insert({
        user_id: user.id,
        amount: validation.data.amount,
        description: validation.data.description,
        category: validation.data.category,
        ai_category: validation.data.category,
        expense_date: validation.data.expense_date,
      });

      if (error) throw error;

      // Reset
      setAmount("");
      setDescription("");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
      onExpenseAdded();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add expense";
      setErrorMsg(msg);
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

      {errorMsg && (
        <div className="auth-error" style={{ marginBottom: 14 }}>
          <AlertCircle size={15} /> {errorMsg}
        </div>
      )}

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
                Categorizing...
              </span>
            )}
            {category && !aiSuggesting && (
              <span className="ai-badge" style={{ marginLeft: 8 }}>
                <Sparkles size={10} /> AI Suggested
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
              <Plus size={16} /> Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
}
