import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinanceAI — Smart Expense Tracking & Insights",
  description:
    "Track your daily expenses with AI-powered categorization and spending insights. Secure, private, and intelligent financial management.",
  keywords: ["finance tracker", "expense tracker", "AI budgeting", "spending insights"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
