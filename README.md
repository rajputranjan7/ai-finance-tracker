# FinanceAI — AI Powered Finance Tracker

An advanced full-stack **Next.js 16** application with **Supabase Backend** for tracking daily expenses, featuring automated AI expense categorization, real-time spending analytics, financial health scoring, and strict **Row-Level Security (RLS)**.

---

## 🌟 Key Features

- **🔐 Bank-Grade Security (Supabase RLS)**: Row-Level Security policies ensure every user can only read, insert, update, and delete their own financial data.
- **🤖 AI Expense Auto-Categorization**: Intelligent rule-based engine automatically detects category from expense descriptions (Food & Dining, Groceries, Travel, Subscriptions, Health, etc.).
- **📊 AI Financial Copilot & Insights**:
  - Interactive AI Copilot assistant for spending query analysis.
  - Automated month-over-month trend analysis and spending spike warnings.
  - Financial Health Score meter (0–100 scale calculation).
  - Recharts interactive donut and area trend graphs.
- **💼 Enterprise Fintech UI**:
  - Stripe/Ramp/Mercury inspired professional design system.
  - Sidebar view switching (Dashboard Overview, Expenses Manager, Insights Analytics).
  - Quick Add Expense modal popup accessible anywhere.
  - Transaction table with text search, category filters, multi-column sorting, and **CSV Export**.

---

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router + TypeScript)
- **Database & Auth**: Supabase (PostgreSQL + RLS + Cookie Auth via `@supabase/ssr`)
- **Styling**: Vanilla CSS Design System with Slate & Indigo high-contrast palette
- **Data Visualization**: Recharts
- **Icons**: Lucide React

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/rajputranjan7/ai-finance-tracker.git
cd ai-finance-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

MIT License. Created for AI Finance Tracking.
