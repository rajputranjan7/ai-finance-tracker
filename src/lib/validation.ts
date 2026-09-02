import { z } from "zod";
import { CATEGORIES } from "./ai-categorizer";

// 1. Expense Input Validation Schema
export const expenseSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .max(100000000, "Amount exceeds maximum limit"),
  description: z
    .string()
    .trim()
    .min(1, "Description cannot be empty")
    .max(500, "Description cannot exceed 500 characters"),
  category: z.enum(CATEGORIES as unknown as [string, ...string[]]),
  expense_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

// 2. Categorization API Input Validation Schema
export const categorizeRequestSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description cannot be empty")
    .max(500, "Description cannot exceed 500 characters"),
});

// 3. User Authentication Input Schema
export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
export type CategorizeInput = z.infer<typeof categorizeRequestSchema>;
export type AuthInput = z.infer<typeof authSchema>;
