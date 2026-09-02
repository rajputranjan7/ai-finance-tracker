"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from "lucide-react";
import type { InsightsData } from "@/lib/ai-categorizer";

interface SummaryCardsProps {
  data: InsightsData | null;
  loading: boolean;
  currentMonthTotal: number;
}

export default function SummaryCards({
  data,
  loading,
  currentMonthTotal,
}: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="summary-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="summary-card">
            <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} />
            <div style={{ marginTop: 12 }}>
              <div className="skeleton" style={{ width: 80, height: 12, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: 110, height: 28 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Calculate month-over-month trend
  let trendPercent = 0;
  let trendUp = false;
  if (data && data.monthlyTrends.length >= 2) {
    const current = data.monthlyTrends[data.monthlyTrends.length - 1].amount;
    const previous = data.monthlyTrends[data.monthlyTrends.length - 2].amount;
    if (previous > 0) {
      trendPercent = Math.round(((current - previous) / previous) * 100);
      trendUp = trendPercent > 0;
    }
  }

  // Calculate financial health percentage (100 - (spent / budget_estimate))
  const monthlyBudget = 25000;
  const healthPercent = Math.max(
    10,
    Math.min(100, Math.round(((monthlyBudget - currentMonthTotal) / monthlyBudget) * 100))
  );

  return (
    <div className="summary-grid">
      {/* 1. Monthly Spend */}
      <div className="summary-card">
        <div className="summary-card-top">
          <div>
            <div className="summary-label">Monthly Spent</div>
            <div className="summary-value">
              ₹{currentMonthTotal.toLocaleString()}
            </div>
          </div>
          <div className="summary-icon indigo">
            <DollarSign size={22} />
          </div>
        </div>

        {data && data.monthlyTrends.length >= 2 ? (
          <div className={`summary-trend ${trendUp ? "down" : "up"}`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trendPercent)}% {trendUp ? "increase" : "decrease"} vs last month
          </div>
        ) : (
          <div className="summary-trend" style={{ color: "var(--text-muted)" }}>
            Updated in real-time
          </div>
        )}

        <div className="summary-progress-bg">
          <div
            className="summary-progress-fill indigo"
            style={{ width: `${Math.min(100, (currentMonthTotal / monthlyBudget) * 100)}%` }}
          />
        </div>
      </div>

      {/* 2. Total Transactions */}
      <div className="summary-card">
        <div className="summary-card-top">
          <div>
            <div className="summary-label">Transactions</div>
            <div className="summary-value">{data?.transactionCount || 0}</div>
          </div>
          <div className="summary-icon emerald">
            <Receipt size={22} />
          </div>
        </div>

        <div className="summary-trend" style={{ color: "var(--emerald-600)" }}>
          <ShieldCheck size={14} /> RLS Encrypted Records
        </div>

        <div className="summary-progress-bg">
          <div
            className="summary-progress-fill emerald"
            style={{ width: `${Math.min(100, (data?.transactionCount || 0) * 5)}%` }}
          />
        </div>
      </div>

      {/* 3. Top Spending Category */}
      <div className="summary-card">
        <div className="summary-card-top">
          <div>
            <div className="summary-label">Top Category</div>
            <div className="summary-value" style={{ fontSize: "1.25rem" }}>
              {data?.topCategory || "N/A"}
            </div>
          </div>
          <div className="summary-icon amber">
            <PieChart size={22} />
          </div>
        </div>

        <div className="summary-trend" style={{ color: "var(--text-muted)" }}>
          {data && data.categoryBreakdown.length > 0
            ? `${data.categoryBreakdown[0].percentage}% of overall spend`
            : "No category data"}
        </div>

        <div className="summary-progress-bg">
          <div
            className="summary-progress-fill amber"
            style={{
              width: `${data?.categoryBreakdown[0]?.percentage || 0}%`,
            }}
          />
        </div>
      </div>

      {/* 4. Financial Health Score */}
      <div className="summary-card">
        <div className="summary-card-top">
          <div>
            <div className="summary-label">Financial Health</div>
            <div className="summary-value">{healthPercent}/100</div>
          </div>
          <div className="summary-icon sky">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="summary-trend" style={{ color: "var(--sky-600)" }}>
          {healthPercent > 50 ? "Optimal Budget Track" : "High Spend Attention Needed"}
        </div>

        <div className="summary-progress-bg">
          <div
            className="summary-progress-fill sky"
            style={{ width: `${healthPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
