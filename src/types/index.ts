
export type Currency = 'تومان' | 'ریال' | 'دلار' | 'یورو' | 'پوند';
export type Language = 'fa' | 'en';
export type Theme = 'light' | 'dark';
export type CalendarSystem = 'shamsi' | 'gregorian';
export type IncomeFrequency = 'روزانه' | 'هفتگی' | 'ماهانه';
export type ExpenseCategory = 'خوراک' | 'پوشاک' | 'حمل و نقل' | 'سرگرمی' | 'سایر';

export interface UserPreferences {
  name: string;
  currency: Currency;
  language: Language;
  theme: Theme;
  calendarSystem: CalendarSystem;
  isFirstLaunch: boolean;
}

export interface TransactionCore {
  id: string;
  currency: Currency;
  date: string; // ISO string
  description?: string;
}

export interface IncomeRecord extends TransactionCore {
  amount: number;
  frequency: IncomeFrequency;
  // productName might not be relevant for all income, but description can be used
}

export interface ExpenseRecord extends TransactionCore {
  productName: string;
  cost: number;
  category: ExpenseCategory;
}

// A unified transaction type could be useful for mixed lists if needed later
// export type Transaction = (IncomeRecord & { type: 'income' }) | (ExpenseRecord & { type: 'expense' });


export interface Option {
  value: string;
  label: string;
}

```