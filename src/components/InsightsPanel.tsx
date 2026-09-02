"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Info,
  AlertCircle,
  Target,
  BarChart3,
  Sparkles,
} from "lucide-react";
import type { InsightsData, SpendingInsight } from "@/lib/ai-categorizer";

interface InsightsPanelProps {
  data: InsightsData | null;
  loading: boolean;
}

function getInsightIcon(icon: string) {
  const icons: Record<string, React.ReactNode> = {
    "trending-up": <TrendingUp size={16} />,
    "alert-triangle": <AlertTriangle size={16} />,
    "check-circle": <CheckCircle2 size={16} />,
    lightbulb: <Lightbulb size={16} />,
    "alert-circle": <AlertCircle size={16} />,
    "pie-chart": <BarChart3 size={16} />,
    target: <Target size={16} />,
    info: <Info size={16} />,
  };
  return icons[icon] || <Info size={16} />;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: "0.8125rem",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ color: "#64748b", marginBottom: 4, fontSize: "0.75rem" }}>
          {label}
        </p>
        <p style={{ fontWeight: 600, color: "#0f172a" }}>
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { category: string; amount: number; percentage: number } }>;
}

function PieTooltip({ active, payload }: PieTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: "0.8125rem",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ fontWeight: 600, color: "#0f172a", marginBottom: 2 }}>
          {data.category}
        </p>
        <p style={{ color: "#475569" }}>
          ₹{data.amount.toLocaleString()} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
}

export default function InsightsPanel({
  data,
  loading,
}: InsightsPanelProps) {
  if (loading) {
    return (
      <div className="insights-section">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">AI Insights</h2>
          </div>
          <div className="skeleton" style={{ height: 250 }} />
        </div>
      </div>
    );
  }

  if (!data || data.transactionCount === 0) {
    return (
      <div className="insights-section">
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">AI Insights</h2>
              <p className="card-subtitle">
                Powered by intelligent analysis
              </p>
            </div>
            <div className="ai-badge">
              <Sparkles size={10} />
              AI
            </div>
          </div>
          <div className="empty-state">
            <div className="empty-state-icon">
              <Sparkles size={24} />
            </div>
            <h3>Awaiting Data</h3>
            <p>
              Log a few expenses and the AI will start generating insights
              about your spending.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="insights-section">
      {/* Category Breakdown Donut */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Spending by Category</h2>
            <p className="card-subtitle">
              Distribution across {data.categoryBreakdown.length} categories
            </p>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="amount"
                nameKey="category"
                stroke="#ffffff"
                strokeWidth={2}
              >
                {data.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 16px",
            marginTop: 8,
          }}
        >
          {data.categoryBreakdown.slice(0, 8).map((cat) => (
            <div
              key={cat.category}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--slate-700)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: cat.color,
                  flexShrink: 0,
                }}
              />
              {cat.category} ({cat.percentage}%)
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      {data.monthlyTrends.length > 1 && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Monthly Trend</h2>
              <p className="card-subtitle">Spending over time</p>
            </div>
          </div>
          <div className="chart-container-sm">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.monthlyTrends}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#4f46e5"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="#4f46e5"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Smart Insights */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Smart Insights</h2>
            <p className="card-subtitle">
              AI-generated recommendations
            </p>
          </div>
          <div className="ai-badge">
            <Sparkles size={10} />
            AI
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.insights.map((insight: SpendingInsight, index: number) => (
            <div key={index} className="insight-card">
              <div className={`insight-icon ${insight.type}`}>
                {getInsightIcon(insight.icon)}
              </div>
              <div className="insight-content">
                <div className="insight-title">{insight.title}</div>
                <div className="insight-message">{insight.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
