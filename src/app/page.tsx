import Link from "next/link";
import { BarChart3, Shield, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-bg" />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="landing-logo-icon">FA</div>
          <span>FinanceAI</span>
        </div>
        <div className="landing-nav-links">
          <Link href="/login" className="btn btn-ghost">
            Log In
          </Link>
          <Link href="/login" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-badge">
          <span className="landing-badge-dot" />
          AI-Powered Finance Tracking
        </div>
        <h1>
          Master Your Money
          <br />
          with <span>Smart Insights</span>
        </h1>
        <p>
          Track daily expenses effortlessly. Our AI automatically categorizes
          your spending, identifies patterns, and delivers actionable insights
          to help you save more.
        </p>
        <div className="landing-cta-group">
          <Link href="/login" className="btn btn-primary btn-lg">
            <Sparkles size={18} />
            Start Tracking Free
          </Link>
          <Link href="/login" className="btn btn-secondary btn-lg">
            View Demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="feature-card">
          <div className="feature-icon indigo">
            <Sparkles size={22} />
          </div>
          <h3>AI Categorization</h3>
          <p>
            Every expense is automatically categorized using intelligent pattern
            recognition. No manual sorting needed — just log and go.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon emerald">
            <BarChart3 size={22} />
          </div>
          <h3>Smart Insights</h3>
          <p>
            Interactive charts and AI-generated insights reveal your spending
            patterns, trends, and areas where you can save money.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon violet">
            <Shield size={22} />
          </div>
          <h3>Bank-Grade Security</h3>
          <p>
            Row-level security ensures your financial data is private. Only you
            can access your expenses — no exceptions.
          </p>
        </div>
      </section>
    </div>
  );
}
