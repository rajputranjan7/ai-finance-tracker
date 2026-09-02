import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { categorizeExpense } from '@/lib/ai-categorizer';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Authentication check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // 2. Rate limiting check (max 30 requests per minute per user)
    const rateCheck = checkRateLimit(`categorize_${user.id}`, 30, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many categorization requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    // 3. Input validation
    const { description } = await request.json();

    if (
      !description ||
      typeof description !== 'string' ||
      description.trim().length === 0 ||
      description.length > 500
    ) {
      return NextResponse.json(
        { error: 'Invalid description. Must be between 1 and 500 characters.' },
        { status: 400 }
      );
    }

    const category = categorizeExpense(description);

    return NextResponse.json({ category });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process categorization request' },
      { status: 500 }
    );
  }
}
