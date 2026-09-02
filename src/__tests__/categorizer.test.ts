import { describe, it, expect } from "vitest";
import { categorizeExpense, generateInsights } from "../lib/ai-categorizer";

describe("AI Categorizer Engine", () => {
  it("correctly categorizes Food & Dining expenses", () => {
    expect(categorizeExpense("Lunch at Starbucks coffee shop")).toBe("Food & Dining");
    expect(categorizeExpense("Uber Eats pizza delivery")).toBe("Food & Dining");
    expect(categorizeExpense("Dinner at Italian restaurant")).toBe("Food & Dining");
  });

  it("correctly categorizes Groceries", () => {
    expect(categorizeExpense("Supermarket grocery shopping")).toBe("Groceries");
    expect(categorizeExpense("Costco fresh vegetables")).toBe("Groceries");
  });

  it("correctly categorizes Transportation", () => {
    expect(categorizeExpense("Uber ride to airport")).toBe("Transportation");
    expect(categorizeExpense("Gas station petrol fill")).toBe("Transportation");
  });

  it("correctly categorizes Subscriptions", () => {
    expect(categorizeExpense("Netflix monthly subscription")).toBe("Subscriptions");
    expect(categorizeExpense("Spotify premium music")).toBe("Subscriptions");
  });

  it("falls back to Other for unknown descriptions", () => {
    expect(categorizeExpense("random unknown item 123")).toBe("Other");
  });

  it("generates correct insights summary from expense data", () => {
    const mockExpenses = [
      { amount: 1500, category: "Food & Dining", expense_date: "2026-09-01", description: "Restaurant dinner" },
      { amount: 3000, category: "Groceries", expense_date: "2026-09-02", description: "Supermarket" },
      { amount: 500, category: "Transportation", expense_date: "2026-09-02", description: "Uber ride" },
    ];

    const result = generateInsights(mockExpenses);

    expect(result.totalSpent).toBe(5000);
    expect(result.transactionCount).toBe(3);
    expect(result.topCategory).toBe("Groceries");
    expect(result.categoryBreakdown.length).toBe(3);
    expect(result.insights.length).toBeGreaterThan(0);
  });
});
