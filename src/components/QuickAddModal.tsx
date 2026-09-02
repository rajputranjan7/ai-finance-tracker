"use client";

import { useState } from "react";
import { X, Sparkles, Plus, DollarSign, Calendar, FileText, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/ai-categorizer";
import { expenseSchema } from "@/lib/validation";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded: () => void;
}

export default function QuickAddModal({
  isOpen,
  onClose,
  onExpenseAdded,
}: QuickAddModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const supabase = createClient();

  if (!isOpen) return null;

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
      onExpenseAdded();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add expense";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--primary-50)",
                color: "var(--primary-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--slate-900)" }}>
                Quick Log Expense
              </h2>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                AI auto-detects category from description
              </p>
            </div>
          </div>

          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="auth-error" style={{ marginBottom: 14 }}>
            <AlertCircle size={15} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="modal-amount">
                Amount (₹)
              </label>
              <div className="form-input-with-icon">
                <DollarSign size={16} className="form-input-icon" />
                <input
                  id="modal-amount"
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
              <label className="form-label" htmlFor="modal-date">
                Date
              </label>
              <div className="form-input-with-icon">
                <Calendar size={16} className="form-input-icon" />
                <input
                  id="modal-date"
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
            <label className="form-label" htmlFor="modal-description">
              Description
            </label>
            <div className="form-input-with-icon">
              <FileText size={16} className="form-input-icon" />
              <input
                id="modal-description"
                type="text"
                className="form-input"
                placeholder="e.g. Grocery shopping at Walmart"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-category">
              Category
              {aiSuggesting && (
                <span className="ai-badge" style={{ marginLeft: 8 }}>
                  Categorizing...
                </span>
              )}
            </label>
            <select
              id="modal-category"
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

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !amount || !description.trim()}
              style={{ flex: 1 }}
            >
              {loading ? <div className="loading-spinner" /> : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
