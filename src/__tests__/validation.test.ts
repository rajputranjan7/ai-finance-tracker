import { describe, it, expect } from "vitest";
import { expenseSchema, categorizeRequestSchema, authSchema } from "../lib/validation";

describe("Zod Validation Schemas", () => {
  it("validates valid expense inputs", () => {
    const validData = {
      amount: 450.5,
      description: "Coffee and snacks",
      category: "Food & Dining",
      expense_date: "2026-09-02",
    };
    const result = expenseSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects negative or zero amounts", () => {
    const invalidData = {
      amount: -100,
      description: "Test expense",
      category: "Other",
      expense_date: "2026-09-02",
    };
    const result = expenseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("rejects empty description or description exceeding 500 chars", () => {
    const emptyDesc = { amount: 10, description: "   ", category: "Other", expense_date: "2026-09-02" };
    expect(expenseSchema.safeParse(emptyDesc).success).toBe(false);

    const longDesc = { amount: 10, description: "a".repeat(501), category: "Other", expense_date: "2026-09-02" };
    expect(expenseSchema.safeParse(longDesc).success).toBe(false);
  });

  it("validates categorize request schema", () => {
    expect(categorizeRequestSchema.safeParse({ description: "Uber cab ride" }).success).toBe(true);
    expect(categorizeRequestSchema.safeParse({ description: "" }).success).toBe(false);
  });

  it("validates auth schema with password min length of 8", () => {
    expect(authSchema.safeParse({ email: "test@example.com", password: "password123" }).success).toBe(true);
    expect(authSchema.safeParse({ email: "invalid-email", password: "password123" }).success).toBe(false);
    expect(authSchema.safeParse({ email: "test@example.com", password: "short" }).success).toBe(false);
  });
});
