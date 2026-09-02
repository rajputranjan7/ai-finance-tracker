// AI-powered expense categorization engine
// Uses keyword matching and pattern recognition for intelligent categorization

export const CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health & Medical',
  'Education',
  'Travel',
  'Subscriptions',
  'Housing & Rent',
  'Personal Care',
  'Gifts & Donations',
  'Income',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  'Food & Dining': [
    'restaurant', 'cafe', 'coffee', 'starbucks', 'mcdonalds', 'burger',
    'pizza', 'sushi', 'lunch', 'dinner', 'breakfast', 'brunch', 'takeout',
    'doordash', 'ubereats', 'grubhub', 'food delivery', 'dine', 'eat',
    'snack', 'bakery', 'deli', 'bar', 'pub', 'kfc', 'subway', 'chipotle',
    'dominos', 'taco', 'noodle', 'ramen', 'thai', 'chinese', 'indian',
    'italian', 'mexican', 'wing', 'fries', 'meal', 'zomato', 'swiggy',
  ],
  'Groceries': [
    'grocery', 'supermarket', 'walmart', 'costco', 'target', 'aldi',
    'kroger', 'whole foods', 'trader joe', 'safeway', 'fresh', 'market',
    'vegetable', 'fruit', 'meat', 'milk', 'bread', 'eggs', 'rice',
    'bigbasket', 'blinkit', 'instamart', 'dmart', 'reliance fresh',
  ],
  'Transportation': [
    'uber', 'lyft', 'taxi', 'cab', 'bus', 'train', 'metro', 'subway',
    'gas', 'fuel', 'petrol', 'diesel', 'parking', 'toll', 'car wash',
    'auto repair', 'mechanic', 'oil change', 'tire', 'ola', 'rapido',
    'commute', 'transit', 'fare', 'ride', 'driving',
  ],
  'Shopping': [
    'amazon', 'ebay', 'flipkart', 'myntra', 'clothing', 'shoes', 'dress',
    'shirt', 'pants', 'jacket', 'accessories', 'electronics', 'gadget',
    'phone', 'laptop', 'headphone', 'watch', 'jewelry', 'furniture',
    'decor', 'home goods', 'ikea', 'mall', 'store', 'shop', 'purchase',
    'buy', 'order', 'delivery',
  ],
  'Entertainment': [
    'movie', 'cinema', 'theater', 'concert', 'show', 'game', 'gaming',
    'steam', 'playstation', 'xbox', 'nintendo', 'park', 'museum',
    'amusement', 'bowling', 'karaoke', 'party', 'event', 'ticket',
    'festival', 'club', 'hobby', 'sport', 'gym membership',
  ],
  'Bills & Utilities': [
    'electric', 'electricity', 'water bill', 'gas bill', 'internet',
    'wifi', 'broadband', 'phone bill', 'mobile bill', 'cable',
    'utility', 'sewage', 'trash', 'garbage', 'maintenance', 'hoa',
    'insurance premium', 'tax', 'jio', 'airtel', 'vodafone', 'bsnl',
  ],
  'Health & Medical': [
    'doctor', 'hospital', 'clinic', 'pharmacy', 'medicine', 'drug',
    'prescription', 'dental', 'dentist', 'eye', 'optician', 'therapy',
    'counseling', 'gym', 'fitness', 'yoga', 'health', 'medical',
    'lab test', 'blood test', 'xray', 'scan', 'surgery', 'vitamin',
    'supplement', 'wellness', 'physiotherapy',
  ],
  'Education': [
    'tuition', 'school', 'college', 'university', 'course', 'class',
    'book', 'textbook', 'udemy', 'coursera', 'skillshare', 'tutorial',
    'training', 'workshop', 'seminar', 'exam', 'test fee', 'stationery',
    'notebook', 'pen', 'education', 'learning', 'study',
  ],
  'Travel': [
    'flight', 'airline', 'hotel', 'airbnb', 'booking', 'hostel',
    'resort', 'vacation', 'trip', 'travel', 'luggage', 'passport',
    'visa', 'tourism', 'sightseeing', 'cruise', 'rental car',
    'makemytrip', 'goibibo', 'oyo', 'cleartrip',
  ],
  'Subscriptions': [
    'netflix', 'spotify', 'hulu', 'disney', 'apple music', 'youtube premium',
    'amazon prime', 'hbo', 'subscription', 'membership', 'monthly plan',
    'annual plan', 'premium', 'pro plan', 'saas', 'software',
    'cloud storage', 'icloud', 'google one', 'dropbox', 'hotstar',
  ],
  'Housing & Rent': [
    'rent', 'mortgage', 'lease', 'apartment', 'house payment',
    'property tax', 'home insurance', 'renovation', 'repair',
    'plumber', 'electrician', 'cleaning', 'maid', 'pest control',
    'security deposit', 'broker', 'landlord',
  ],
  'Personal Care': [
    'haircut', 'salon', 'spa', 'massage', 'skincare', 'cosmetics',
    'makeup', 'perfume', 'grooming', 'barber', 'facial', 'manicure',
    'pedicure', 'shampoo', 'soap', 'lotion', 'beauty',
  ],
  'Gifts & Donations': [
    'gift', 'present', 'donation', 'charity', 'fundraiser', 'tip',
    'birthday gift', 'wedding gift', 'christmas', 'holiday gift',
    'contribution', 'offering', 'tithe',
  ],
  'Income': [
    'salary', 'wage', 'paycheck', 'bonus', 'freelance', 'refund',
    'reimbursement', 'dividend', 'interest earned', 'cashback', 'reward',
    'income', 'earning', 'payment received', 'credit',
  ],
  'Other': [],
};

export function categorizeExpense(description: string): Category {
  const lower = description.toLowerCase().trim();

  let bestMatch: Category = 'Other';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        // Longer keyword matches are more specific and get higher scores
        const score = keyword.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = category as Category;
        }
      }
    }
  }

  return bestMatch;
}

export interface SpendingInsight {
  type: 'info' | 'warning' | 'success' | 'tip';
  title: string;
  message: string;
  icon: string;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  amount: number;
}

export interface InsightsData {
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: MonthlyTrend[];
  insights: SpendingInsight[];
  totalSpent: number;
  transactionCount: number;
  topCategory: string;
  averageTransaction: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#6366f1',
  'Groceries': '#8b5cf6',
  'Transportation': '#06b6d4',
  'Shopping': '#f59e0b',
  'Entertainment': '#ec4899',
  'Bills & Utilities': '#64748b',
  'Health & Medical': '#10b981',
  'Education': '#3b82f6',
  'Travel': '#f97316',
  'Subscriptions': '#a855f7',
  'Housing & Rent': '#14b8a6',
  'Personal Care': '#e879f9',
  'Gifts & Donations': '#fb7185',
  'Income': '#22c55e',
  'Other': '#94a3b8',
};

interface Expense {
  amount: number;
  category: string;
  expense_date: string;
  description: string;
}

export function generateInsights(expenses: Expense[]): InsightsData {
  if (!expenses.length) {
    return {
      categoryBreakdown: [],
      monthlyTrends: [],
      insights: [
        {
          type: 'info',
          title: 'No Data Yet',
          message: 'Start logging your expenses to see AI-powered insights about your spending habits.',
          icon: 'info',
        },
      ],
      totalSpent: 0,
      transactionCount: 0,
      topCategory: 'N/A',
      averageTransaction: 0,
    };
  }

  // Category breakdown
  const categoryMap = new Map<string, { amount: number; count: number }>();
  let totalSpent = 0;

  for (const expense of expenses) {
    const amt = Number(expense.amount);
    totalSpent += amt;
    const existing = categoryMap.get(expense.category) || { amount: 0, count: 0 };
    categoryMap.set(expense.category, {
      amount: existing.amount + amt,
      count: existing.count + 1,
    });
  }

  const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      amount: Math.round(data.amount * 100) / 100,
      count: data.count,
      percentage: Math.round((data.amount / totalSpent) * 1000) / 10,
      color: CATEGORY_COLORS[category] || '#94a3b8',
    }))
    .sort((a, b) => b.amount - a.amount);

  // Monthly trends
  const monthMap = new Map<string, number>();
  for (const expense of expenses) {
    const date = new Date(expense.expense_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthMap.set(key, (monthMap.get(key) || 0) + Number(expense.amount));
  }

  const monthlyTrends: MonthlyTrend[] = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => {
      const [year, m] = month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        month: `${monthNames[parseInt(m) - 1]} ${year}`,
        amount: Math.round(amount * 100) / 100,
      };
    });

  // Top category
  const topCategory = categoryBreakdown[0]?.category || 'N/A';
  const averageTransaction = Math.round((totalSpent / expenses.length) * 100) / 100;

  // Generate smart insights
  const insights: SpendingInsight[] = [];

  // Top spending category insight
  if (categoryBreakdown.length > 0) {
    const top = categoryBreakdown[0];
    insights.push({
      type: 'info',
      title: 'Top Spending Category',
      message: `${top.category} accounts for ${top.percentage}% of your spending (₹${top.amount.toLocaleString()}).`,
      icon: 'trending-up',
    });
  }

  // Month-over-month comparison
  if (monthlyTrends.length >= 2) {
    const current = monthlyTrends[monthlyTrends.length - 1].amount;
    const previous = monthlyTrends[monthlyTrends.length - 2].amount;
    const change = ((current - previous) / previous) * 100;

    if (change > 20) {
      insights.push({
        type: 'warning',
        title: 'Spending Spike',
        message: `Your spending this month is ${Math.abs(Math.round(change))}% higher than last month. Review recent transactions for unnecessary expenses.`,
        icon: 'alert-triangle',
      });
    } else if (change < -10) {
      insights.push({
        type: 'success',
        title: 'Great Savings!',
        message: `You've reduced spending by ${Math.abs(Math.round(change))}% compared to last month. Keep it up!`,
        icon: 'check-circle',
      });
    }
  }

  // High-frequency category
  const frequentCategory = categoryBreakdown.find((c) => c.count >= 5);
  if (frequentCategory) {
    insights.push({
      type: 'tip',
      title: 'Frequent Spending',
      message: `You've made ${frequentCategory.count} transactions in ${frequentCategory.category}. Consider setting a budget to manage this area.`,
      icon: 'lightbulb',
    });
  }

  // Large transaction alert
  const largeTransactions = expenses.filter((e) => Number(e.amount) > averageTransaction * 3);
  if (largeTransactions.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Large Transactions Detected',
      message: `${largeTransactions.length} transaction(s) are 3x above your average of ₹${averageTransaction.toLocaleString()}.`,
      icon: 'alert-circle',
    });
  }

  // Diversification tip
  if (categoryBreakdown.length <= 2 && expenses.length >= 5) {
    insights.push({
      type: 'tip',
      title: 'Low Diversity',
      message: 'Most of your spending is concentrated in few categories. Make sure you\'re tracking all expense types.',
      icon: 'pie-chart',
    });
  }

  // Budget recommendation
  if (categoryBreakdown.length > 0) {
    const recommended = Math.round(categoryBreakdown[0].amount * 0.9);
    insights.push({
      type: 'tip',
      title: 'Budget Recommendation',
      message: `Consider setting a monthly budget of ₹${recommended.toLocaleString()} for ${categoryBreakdown[0].category} (10% below current spending).`,
      icon: 'target',
    });
  }

  return {
    categoryBreakdown,
    monthlyTrends,
    insights,
    totalSpent: Math.round(totalSpent * 100) / 100,
    transactionCount: expenses.length,
    topCategory,
    averageTransaction,
  };
}
