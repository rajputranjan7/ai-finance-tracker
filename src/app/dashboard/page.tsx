"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTab } from "@/context/TabContext";
import SummaryCards from "@/components/SummaryCards";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import InsightsPanel from "@/components/InsightsPanel";
import AIQuickAsk from "@/components/AIQuickAsk";
import QuickAddModal from "@/components/QuickAddModal";
import { Plus, Sparkles, SlidersHorizontal, CalendarDays } from "lucide-react";
import type { InsightsData } from "@/lib/ai-categorizer";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  expense_date: string;
  created_at: string;
}

export default function DashboardPage() {
  const { activeTab } = useTab();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const fetchExpenses = useCallback(async () => {
    setLoadingExpenses(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("expense_date", { ascending: false })
      .limit(100);

    if (!error && data) {
      setExpenses(data);
    }
    setLoadingExpenses(false);
  }, [supabase]);

  const fetchInsights = useCallback(async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch("/api/insights");
      const data = await res.json();
      if (!data.error) {
        setInsights(data);
      }
    } catch {
      // Insights error handling
    }
    setLoadingInsights(false);
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchInsights();
  }, [fetchExpenses, fetchInsights]);

  const handleDataChange = () => {
    fetchExpenses();
    fetchInsights();
  };

  // Calculate current month total
  const now = new Date();
  const currentMonthTotal = expenses
    .filter((e) => {
      const d = new Date(e.expense_date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <>
      {/* Top Navbar Header */}
      <div className="top-navbar">
        <div className="top-navbar-left">
          <div>
            <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--slate-900)" }}>
              {activeTab === "dashboard" && "Financial Dashboard"}
              {activeTab === "expenses" && "Expenses & Transactions"}
              {activeTab === "insights" && "AI Financial Analytics"}
            </h1>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 2 }}>
              {activeTab === "dashboard" && "Real-time overview of daily spending and budget trends"}
              {activeTab === "expenses" && "Log, filter, and export all personal finance records"}
              {activeTab === "insights" && "AI-generated category breakdown and smart recommendations"}
            </p>
          </div>
        </div>

        <div className="top-navbar-right">
          <div className="ai-status-indicator">
            <span className="ai-status-pulse" />
            AI RLS Active
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsModalOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={16} /> Quick Add Expense
          </button>
        </div>
      </div>

      {/* DASHBOARD TAB VIEW */}
      {activeTab === "dashboard" && (
        <>
          <SummaryCards
            data={insights}
            loading={loadingInsights}
            currentMonthTotal={Math.round(currentMonthTotal * 100) / 100}
          />

          {/* AI Copilot Prompt Box */}
          <AIQuickAsk insightsData={insights} />

          <div className="dashboard-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <ExpenseForm onExpenseAdded={handleDataChange} />
              <ExpenseTable
                expenses={expenses}
                loading={loadingExpenses}
                onDelete={handleDataChange}
              />
            </div>
            <div>
              <InsightsPanel data={insights} loading={loadingInsights} />
            </div>
          </div>
        </>
      )}

      {/* EXPENSES TAB VIEW */}
      {activeTab === "expenses" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ExpenseForm onExpenseAdded={handleDataChange} />
          <ExpenseTable
            expenses={expenses}
            loading={loadingExpenses}
            onDelete={handleDataChange}
            fullWidthView={true}
          />
        </div>
      )}

      {/* INSIGHTS TAB VIEW */}
      {activeTab === "insights" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <SummaryCards
            data={insights}
            loading={loadingInsights}
            currentMonthTotal={Math.round(currentMonthTotal * 100) / 100}
          />
          <AIQuickAsk insightsData={insights} />
          <InsightsPanel data={insights} loading={loadingInsights} />
        </div>
      )}

      {/* Quick Add Modal Popup */}
      <QuickAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExpenseAdded={handleDataChange}
      />
    </>
  );
}
