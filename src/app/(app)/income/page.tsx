'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useState } from 'react';
import AddTransactionDialog from '@/components/shared/add-transaction-dialog';

export default function IncomePage() {
  const { t } = useTranslation();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('incomeTitle')}</h1>
        <Button onClick={() => setIsAddTransactionOpen(true)}>
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('addIncome')}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <span>{t('incomeManagement')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <AlertTriangle className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl font-semibold text-muted-foreground">
            بخش مدیریت درآمد در حال ساخت است.
          </p>
          <p className="text-muted-foreground">
            به زودی قادر خواهید بود درآمدهای خود را در اینجا ثبت و مدیریت کنید.
          </p>
        </CardContent>
      </Card>
      <AddTransactionDialog 
        isOpen={isAddTransactionOpen} 
        onOpenChange={setIsAddTransactionOpen} 
        defaultTab="income"
      />
    </div>
  );
}
