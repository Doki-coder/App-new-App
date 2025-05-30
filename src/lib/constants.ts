import type { UserPreferences, Option, CalendarSystem } from '@/types';

export const CURRENCIES: Option[] = [
  { value: 'تومان', label: 'تومان (IRT)' },
  { value: 'ریال', label: 'ریال (IRR)' },
  { value: 'دلار', label: 'دلار (USD)' },
  { value: 'یورو', label: 'یورو (EUR)' },
  { value: 'پوند', label: 'پوند (GBP)' },
];

export const LANGUAGES: Option[] = [
  { value: 'fa', label: 'فارسی' },
  { value: 'en', label: 'English' },
];

export const THEMES: Option[] = [
  { value: 'light', label: 'روشن' }, // Light
  { value: 'dark', label: 'تاریک' },  // Dark
];

export const CALENDAR_SYSTEMS: { value: CalendarSystem, labelKey: 'shamsi' | 'gregorian' }[] = [
  { value: 'shamsi', labelKey: 'shamsi' },
  { value: 'gregorian', labelKey: 'gregorian' },
];

export const INCOME_FREQUENCIES: Option[] = [
  { value: 'روزانه', label: 'روزانه' }, // Daily
  { value: 'هفتگی', label: 'هفتگی' },   // Weekly
  { value: 'ماهانه', label: 'ماهانه' },  // Monthly
];

export const EXPENSE_CATEGORIES: Option[] = [
  { value: 'خوراک', label: 'خوراک' },       // Food
  { value: 'پوشاک', label: 'پوشاک' },      // Clothing
  { value: 'حمل و نقل', label: 'حمل و نقل' }, // Transportation
  { value: 'سرگرمی', label: 'سرگرمی' },    // Entertainment
  { value: 'سایر', label: 'سایر' },        // Other
];

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  name: '',
  currency: 'تومان',
  language: 'fa',
  theme: 'light',
  calendarSystem: 'shamsi',
  isFirstLaunch: true,
};
