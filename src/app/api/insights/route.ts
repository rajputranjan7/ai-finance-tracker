import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateInsights } from '@/lib/ai-categorizer';

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch last 6 months of expenses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('amount, category, expense_date, description')
      .gte('expense_date', sixMonthsAgo.toISOString().split('T')[0])
      .order('expense_date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const insights = generateInsights(expenses || []);

    return NextResponse.json(insights);
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
