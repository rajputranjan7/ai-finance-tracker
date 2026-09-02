import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateInsights } from '@/lib/ai-categorizer';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Authentication check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate limiting check (max 30 requests per minute per user)
    const rateCheck = checkRateLimit(`insights_${user.id}`, 30, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    // Fetch last 6 months of expenses (RLS automatically restricts to auth.uid() = user_id)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('amount, category, expense_date, description')
      .gte('expense_date', sixMonthsAgo.toISOString().split('T')[0])
      .order('expense_date', { ascending: false });

    if (error) {
      console.error('Database error in insights route:', error);
      return NextResponse.json(
        { error: 'Failed to fetch insights data' },
        { status: 500 }
      );
    }

    const insights = generateInsights(expenses || []);

    return NextResponse.json(insights);
  } catch (err) {
    console.error('Unexpected error in insights route:', err);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
