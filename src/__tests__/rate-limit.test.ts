import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../lib/rate-limit";

describe("Rate Limiter Engine", () => {
  it("allows requests under the limit", () => {
    const userId = "user_test_1";
    const res1 = checkRateLimit(userId, 5, 60000);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(4);
  });

  it("blocks requests that exceed the limit", () => {
    const userId = "user_test_limit";
    // Hit limit 3 times
    checkRateLimit(userId, 3, 60000);
    checkRateLimit(userId, 3, 60000);
    checkRateLimit(userId, 3, 60000);

    // 4th request should fail
    const blockedRes = checkRateLimit(userId, 3, 60000);
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.remaining).toBe(0);
  });
});
