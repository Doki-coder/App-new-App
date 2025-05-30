
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, DollarSign, TrendingUp, TrendingDown, BarChart3, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useTranslation } from '@/hooks/use-translation';
import AddTransactionDialog from '@/components/shared/add-transaction-dialog';
import { useState, useEffect } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import Link from 'next/link';

// Mock data for now - can be replaced with actual data fetching
const MOCK_TOTAL_INCOME = 5000000;
const MOCK_TOTAL_EXPENSES = 6500000; // Adjusted for testing analysis card

const initialMonthlySpendingData = [
  { month: "فروردین", total: 0 },
  { month: "اردیبهشت", total: 0 },
  { month: "خرداد", total: 0 },
  { month: "تیر", total: 0 },
  { month: "مرداد", total: 0 },
  { month: "شهریور", total: 0 },
];

const chartConfig = {
  total: {
    label: "Total Spending", 
    color: "hsl(var(--primary))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;

const expenseCategoriesData = [
    { name: 'خوراک', value: 400, color: 'hsl(var(--chart-1))' },
    { name: 'پوشاک', value: 300, color: 'hsl(var(--chart-2))' },
    { name: 'حمل و نقل', value: 300, color: 'hsl(var(--chart-3))' },
    { name: 'سرگرمی', value: 200, color: 'hsl(var(--chart-4))' },
    { name: 'سایر', value: 278, color: 'hsl(var(--chart-5))' },
];


export default function DashboardPage() {
  const { preferences } = useUser();
  const { t, lang } = useTranslation();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [monthlySpendingData, setMonthlySpendingData] = useState(initialMonthlySpendingData);

  useEffect(() => {
    const variedBaseSpending = [2200000, 3100000, 2500000, 4000000, 3300000, 4800000, 1900000, 3800000, 2700000, 4500000, 3000000, 5200000];
    const months = lang === 'fa' 
        ? ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const data = months.slice(0, 6).map((month, index) => ({ 
      month,
      total: variedBaseSpending[index % variedBaseSpending.length] + (Math.floor(Math.random() * 1500000) - 750000),
    }));
    setMonthlySpendingData(data);
  }, [lang]);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ` ${preferences.currency}`;
  };

  const netBalance = MOCK_TOTAL_INCOME - MOCK_TOTAL_EXPENSES;

  const financialStatus = () => {
    if (MOCK_TOTAL_EXPENSES > MOCK_TOTAL_INCOME) {
      return {
        messageKey: 'expensesExceedIncome',
        icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
        cardClass: "border-destructive bg-destructive/10",
        textClass: "text-destructive"
      };
    } else if (MOCK_TOTAL_INCOME > MOCK_TOTAL_EXPENSES) {
      return {
        messageKey: 'incomeExceedsExpenses',
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        cardClass: "border-green-500 bg-green-500/10",
        textClass: "text-green-600 dark:text-green-400"
      };
    } else {
      return {
        messageKey: 'incomeEqualsExpenses',
        icon: <Info className="h-6 w-6 text-blue-500" />,
        cardClass: "border-blue-500 bg-blue-500/10",
        textClass: "text-blue-600 dark:text-blue-400"
      };
    }
  };
  const status = financialStatus();


  return (
    <div className="flex flex-col gap-6 rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('welcome')}, {preferences.name || t('user')}!
          </h1>
          <p className="text-muted-foreground">
            {t('dashboardSubtitle')}
          </p>
        </div>
        <Button onClick={() => setIsAddTransactionOpen(true)} className="shadow-md">
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('addTransaction')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalIncome')}</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(MOCK_TOTAL_INCOME)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalExpenses')}</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(MOCK_TOTAL_EXPENSES)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('netBalance')}</CardTitle>
            <DollarSign className={`h-5 w-5 ${netBalance >= 0 ? 'text-blue-500' : 'text-orange-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance < 0 ? 'text-destructive' : ''}`}>
              {formatCurrency(netBalance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={`shadow-lg ${status.cardClass}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status.icon}
            <span>{t('financialAnalysis')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-sm ${status.textClass}`}>
            {t(status.messageKey as 'expensesExceedIncome' | 'incomeExceedsExpenses' | 'incomeEqualsExpenses')}
          </p>
           <p className="text-xs text-muted-foreground mt-2">
            {t('totalIncome')}: {formatCurrency(MOCK_TOTAL_INCOME)} | {t('totalExpenses')}: {formatCurrency(MOCK_TOTAL_EXPENSES)}
          </p>
        </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('monthlySpending')}</CardTitle>
            <CardDescription>{t('monthlySpendingDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySpendingData} margin={{ top: 5, right: lang === 'fa' ? 20: 0, left: lang === 'fa' ? 0 : 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} reversed={lang === 'fa'} />
                  <YAxis orientation={lang === 'fa' ? 'right' : 'left'} tickFormatter={(value) => `${value / 1000000}${t('millionLabel')}`} />
                  <ChartTooltip content={<ChartTooltipContent currency={preferences.currency} />} />
                  <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>{t('expenseCategories')}</CardTitle>
                <CardDescription>{t('expenseCategoriesDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                 <ChartContainer config={{}} className="h-[300px] w-full aspect-square">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel currency={preferences.currency}/>} />
                            <Pie data={expenseCategoriesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {expenseCategoriesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                             <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{t('recentTransactions')}</CardTitle>
          <Button variant="link" className="p-0 h-auto" asChild>
            <Link href="/transactions">{t('viewAll')}</Link>
          </Button>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-10">
            <BarChart3 className="mx-auto h-12 w-12 mb-2" />
          {t('noTransactionsDashboard')}
        </CardContent>
      </Card>

      <AddTransactionDialog isOpen={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen} />
    </div>
  );
}
