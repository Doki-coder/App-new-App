'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';

import { format } from 'date-fns';
import { format as formatJalali } from 'date-fns-jalali';
import { faIR as localeFaIR } from 'date-fns/locale/fa-IR';
import { enUS as localeEnUS } from 'date-fns/locale/en-US';
import { faIR as localeFaIRJalali } from 'date-fns-jalali/locale';


import { useUser } from '@/hooks/use-user';
import { useTranslation } from '@/hooks/use-translation';
import { CURRENCIES, INCOME_FREQUENCIES, EXPENSE_CATEGORIES } from '@/lib/constants';
import type { IncomeFrequency, ExpenseCategory, Currency } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AddTransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  defaultTab?: 'income' | 'expense';
}

export default function AddTransactionDialog({ isOpen, onOpenChange, defaultTab = 'expense' }: AddTransactionDialogProps) {
  const { preferences } = useUser();
  const { t, lang } = useTranslation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'income' | 'expense'>(defaultTab);
  
  // Income States
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeCurrency, setIncomeCurrency] = useState<Currency>(preferences.currency);
  const [incomeFrequency, setIncomeFrequency] = useState<IncomeFrequency | undefined>(undefined);
  const [incomeDate, setIncomeDate] = useState<Date | undefined>(new Date());
  const [incomeDescription, setIncomeDescription] = useState('');

  // Expense States
  const [expenseName, setExpenseName] = useState('');
  const [expenseCost, setExpenseCost] = useState('');
  const [expenseCurrency, setExpenseCurrency] = useState<Currency>(preferences.currency);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory | undefined>(undefined);
  const [expenseDate, setExpenseDate] = useState<Date | undefined>(new Date());
  const [expenseDescription, setExpenseDescription] = useState('');
  
  useEffect(() => {
    setActiveTab(defaultTab);
    setIncomeCurrency(preferences.currency);
    setExpenseCurrency(preferences.currency);
  }, [defaultTab, isOpen, preferences.currency]);


  const handleSubmit = () => {
    if (activeTab === 'income') {
      if (!incomeAmount || !incomeFrequency || !incomeDate) {
        toast({ title: t('requiredField'), description: t('fillAllRequiredFields'), variant: 'destructive' });
        return;
      }
      console.log('Income Data:', { incomeAmount, incomeCurrency, incomeFrequency, incomeDate, incomeDescription });
      toast({ title: t('incomeAddedSuccessfully') });
    } else {
      if (!expenseName || !expenseCost || !expenseCategory || !expenseDate) {
        toast({ title: t('requiredField'), description: t('fillAllRequiredFields'), variant: 'destructive' });
        return;
      }
      console.log('Expense Data:', { expenseName, expenseCost, expenseCurrency, expenseCategory, expenseDate, expenseDescription });
      toast({ title: t('expenseAddedSuccessfully') });
    }
    onOpenChange(false); 
    resetForms();
  };
  
  const resetForms = () => {
    setIncomeAmount('');
    setIncomeCurrency(preferences.currency);
    setIncomeFrequency(undefined);
    setIncomeDate(new Date());
    setIncomeDescription('');
    setExpenseName('');
    setExpenseCost('');
    setExpenseCurrency(preferences.currency);
    setExpenseCategory(undefined);
    setExpenseDate(new Date());
    setExpenseDescription('');
  };
  
  const effectiveLocale = preferences.calendarSystem === 'shamsi'
    ? localeFaIRJalali
    : (lang === 'fa' ? localeFaIR : localeEnUS);

  const effectiveFormatDate = (date: Date, formatString: string) => {
    if (preferences.calendarSystem === 'shamsi') {
      return formatJalali(date, formatString, { locale: localeFaIRJalali });
    }
    return format(date, formatString, { locale: lang === 'fa' ? localeFaIR : localeEnUS });
  };
  
  const calendarDir = preferences.calendarSystem === 'shamsi' ? 'rtl' : (lang === 'fa' ? 'rtl' : 'ltr');


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForms(); }}>
      <DialogContent className="sm:max-w-[525px] shadow-xl" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>{t('addTransaction')}</DialogTitle>
          <DialogDescription>
            {activeTab === 'income' ? t('incomeDetails') : t('expenseDetails')}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'income' | 'expense')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income">{t('income')}</TabsTrigger>
            <TabsTrigger value="expense">{t('expense')}</TabsTrigger>
          </TabsList>
          <TabsContent value="income">
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income-amount">{t('amount')}</Label>
                  <Input id="income-amount" type="number" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income-currency">{t('currency')}</Label>
                   <Select value={incomeCurrency} onValueChange={(value: Currency) => setIncomeCurrency(value)}>
                        <SelectTrigger id="income-currency">
                            <SelectValue placeholder={t('selectCurrency')} />
                        </SelectTrigger>
                        <SelectContent>
                            {CURRENCIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="income-frequency">{t('frequency')}</Label>
                <Select value={incomeFrequency} onValueChange={(value: IncomeFrequency) => setIncomeFrequency(value)}>
                  <SelectTrigger id="income-frequency">
                    <SelectValue placeholder={t('selectFrequency')} />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOME_FREQUENCIES.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="income-date">{t('date')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="income-date" variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {incomeDate ? effectiveFormatDate(incomeDate, 'PPP') : <span>{t('selectDate')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={incomeDate} onSelect={setIncomeDate} initialFocus locale={effectiveLocale} dir={calendarDir}/>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="income-description">{t('description')}</Label>
                <Textarea id="income-description" value={incomeDescription} onChange={(e) => setIncomeDescription(e.target.value)} placeholder="توضیحات اختیاری..." />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="expense">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="expense-name">{t('productName')}</Label>
                <Input id="expense-name" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} placeholder="مثلا: خرید شیر" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-cost">{t('amount')}</Label>
                  <Input id="expense-cost" type="number" value={expenseCost} onChange={(e) => setExpenseCost(e.target.value)} placeholder="0" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="expense-currency">{t('currency')}</Label>
                   <Select value={expenseCurrency} onValueChange={(value: Currency) => setExpenseCurrency(value)}>
                        <SelectTrigger id="expense-currency">
                            <SelectValue placeholder={t('selectCurrency')} />
                        </SelectTrigger>
                        <SelectContent>
                            {CURRENCIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-category">{t('category')}</Label>
                <Select value={expenseCategory} onValueChange={(value: ExpenseCategory) => setExpenseCategory(value)}>
                  <SelectTrigger id="expense-category">
                    <SelectValue placeholder={t('selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-date">{t('date')}</Label>
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button id="expense-date" variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expenseDate ? effectiveFormatDate(expenseDate, 'PPP') : <span>{t('selectDate')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={expenseDate} onSelect={setExpenseDate} initialFocus locale={effectiveLocale} dir={calendarDir}/>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-description">{t('description')}</Label>
                <Textarea id="expense-description" value={expenseDescription} onChange={(e) => setExpenseDescription(e.target.value)} placeholder="توضیحات اختیاری..." />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {t('cancel')}
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} className="shadow-md">
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
