"use client";

import { useState } from "react";
import { Trash2, Receipt, Search, Download, ArrowUpDown, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/ai-categorizer";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  expense_date: string;
  created_at: string;
}

interface ExpenseTableProps {
  expenses: Expense[];
  loading: boolean;
  onDelete: () => void;
  fullWidthView?: boolean;
}

function getCategoryClass(category: string): string {
  const map: Record<string, string> = {
    "Food & Dining": "food",
    Groceries: "groceries",
    Transportation: "transport",
    Shopping: "shopping",
    Entertainment: "entertainment",
    "Bills & Utilities": "bills",
    "Health & Medical": "health",
    Education: "education",
    Travel: "travel",
    Subscriptions: "subscriptions",
    "Housing & Rent": "housing",
    "Personal Care": "personal",
    "Gifts & Donations": "gifts",
    Income: "income",
    Other: "other",
  };
  return map[category] || "other";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ExpenseTable({
  expenses,
  loading,
  onDelete,
  fullWidthView = false,
}: ExpenseTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc");
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (!error) {
      onDelete();
    }
  };

  // Export Expenses to CSV
  const handleExportCSV = () => {
    if (!expenses.length) return;
    const headers = ["Description,Category,Amount(INR),Date\n"];
    const rows = expenses.map(
      (e) => `"${e.description.replace(/"/g, '""')}",${e.category},${e.amount},${e.expense_date}`
    );
    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `FinanceAI_Expenses_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  let filtered = expenses.filter((e) => {
    const matchesSearch = e.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort logic
  filtered = [...filtered].sort((a, b) => {
    if (sortOrder === "date-desc") return new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime();
    if (sortOrder === "date-asc") return new Date(a.expense_date).getTime() - new Date(b.expense_date).getTime();
    if (sortOrder === "amount-desc") return Number(b.amount) - Number(a.amount);
    if (sortOrder === "amount-asc") return Number(a.amount) - Number(b.amount);
    return 0;
  });

  const totalFilteredSum = filtered.reduce((acc, item) => acc + Number(item.amount), 0);

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Expenses</h2>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 44, marginBottom: 8 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header" style={{ flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 className="card-title">
            {fullWidthView ? "Transaction History" : "Recent Expenses"}
          </h2>
          <p className="card-subtitle">
            Showing {filtered.length} of {expenses.length} records • Total: ₹
            {totalFilteredSum.toLocaleString()}
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleExportCSV}
            title="Export transactions to CSV file"
          >
            <Download size={14} /> Export CSV
          </button>

          <div className="form-input-with-icon" style={{ minWidth: 150 }}>
            <Search size={14} className="form-input-icon" />
            <input
              type="text"
              className="form-input"
              style={{ fontSize: "0.8125rem", padding: "6px 10px 6px 32px" }}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{
              fontSize: "0.8125rem",
              padding: "6px 28px 6px 12px",
              height: "32px",
            }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            style={{
              fontSize: "0.8125rem",
              padding: "6px 28px 6px 12px",
              height: "32px",
            }}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
          >
            <option value="date-desc">Newest Date</option>
            <option value="date-asc">Oldest Date</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Receipt size={24} />
          </div>
          <h3>No Transactions Found</h3>
          <p>
            {expenses.length === 0
              ? "Start logging your daily expenses to track your finances."
              : "No expenses match your search query."}
          </p>
        </div>
      ) : (
        <div className="expense-table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th style={{ width: 44 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((expense) => (
                <tr key={expense.id}>
                  <td style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    {expense.description}
                  </td>
                  <td>
                    <span className={`category-pill ${getCategoryClass(expense.category)}`}>
                      <Sparkles size={10} />
                      {expense.category}
                    </span>
                  </td>
                  <td className="expense-date">
                    {formatDate(expense.expense_date)}
                  </td>
                  <td className="expense-amount" style={{ textAlign: "right" }}>
                    ₹{Number(expense.amount).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      onClick={() => handleDelete(expense.id)}
                      title="Delete expense"
                      style={{ color: "var(--rose-600)" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
