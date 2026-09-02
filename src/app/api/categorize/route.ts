import { NextResponse } from 'next/server';
import { categorizeExpense } from '@/lib/ai-categorizer';

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const category = categorizeExpense(description);

    return NextResponse.json({ category });
  } catch {
    return NextResponse.json(
      { error: 'Failed to categorize' },
      { status: 500 }
    );
  }
}
