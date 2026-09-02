"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TabProvider, useTab, TabType } from "@/context/TabContext";
import {
  LayoutDashboard,
  LogOut,
  TrendingUp,
  Receipt,
  Wallet,
} from "lucide-react";

interface UserData {
  email: string;
  id: string;
}

function SidebarNav() {
  const { activeTab, setActiveTab } = useTab();

  return (
    <nav className="sidebar-nav">
      <button
        className={`sidebar-link ${activeTab === "dashboard" ? "active" : ""}`}
        onClick={() => setActiveTab("dashboard")}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </button>
      <button
        className={`sidebar-link ${activeTab === "expenses" ? "active" : ""}`}
        onClick={() => setActiveTab("expenses")}
      >
        <Receipt size={18} />
        Expenses
      </button>
      <button
        className={`sidebar-link ${activeTab === "insights" ? "active" : ""}`}
        onClick={() => setActiveTab("insights")}
      >
        <TrendingUp size={18} />
        Insights
      </button>
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({ email: user.email || "", id: user.id });
      } else {
        router.push("/login");
      }
    };
    getUser();
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "FA";

  return (
    <TabProvider>
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">
                <Wallet size={18} />
              </div>
              <span>FinanceAI</span>
            </div>
          </div>

          <SidebarNav />

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-avatar">{initials}</div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">
                  {user?.email?.split("@")[0] || "User"}
                </div>
                <div className="sidebar-user-email">{user?.email || ""}</div>
              </div>
            </div>
            <button
              className="sidebar-link logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">{children}</main>
      </div>
    </TabProvider>
  );
}
