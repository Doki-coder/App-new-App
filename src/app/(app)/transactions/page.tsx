
'use client';

import type React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Eye, Trash2, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { ExpenseRecord } from '@/types';
import { useUser } from '@/hooks/use-user';
import { format } from 'date-fns';
import { format as formatJalali } from 'date-fns-jalali';
import { faIR as localeFaIRJalali } from 'date-fns-jalali/locale';
import { enUS as localeEnUS } from 'date-fns/locale/en-US';
import { faIR as localeFaIR } from 'date-fns/locale/fa-IR';

// Mock Data - Replace with actual data fetching and state management
const MOCK_EXPENSES: ExpenseRecord[] = [
  { id: '1', productName: 'خرید هفتگی میوه', cost: 150000, currency: 'تومان', category: 'خوراک', date: new Date(2024, 5, 10).toISOString(), description: 'شامل سیب، پرتقال، موز و توت فرنگی از فروشگاه محله.' },
  { id: '2', productName: 'پرداخت قبض اینترنت', cost: 250000, currency: 'تومان', category: 'سایر', date: new Date(2024, 5, 12).toISOString(), description: 'اینترنت فیبر نوری ۵۰ مگابیت ماهانه.' },
  { id: '3', productName: 'بلیط سینما', cost: 80000, currency: 'تومان', category: 'سرگرمی', date: new Date(2024, 5, 15).toISOString() },
  { id: '4', productName: 'تیشرت جدید', cost: 350000, currency: 'تومان', category: 'پوشاک', date: new Date(2024, 5, 18).toISOString(), description: 'تیشرت نخی از برند X.' },
  { id: '5', productName: 'شارژ کارت مترو', cost: 50000, currency: 'تومان', category: 'حمل و نقل', date: new Date(2024, 5, 20).toISOString() },
];

export default function TransactionsPage() {
  const { t, lang } = useTranslation();
  const { preferences } = useUser();
  const [transactions, setTransactions] = useState<ExpenseRecord[]>(MOCK_EXPENSES);
  const [selectedTransaction, setSelectedTransaction] = useState<ExpenseRecord | null>(null);
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<ExpenseRecord | null>(null);


  const effectiveLocale = preferences.calendarSystem === 'shamsi'
    ? localeFaIRJalali
    : (lang === 'fa' ? localeFaIR : localeEnUS);

  const effectiveFormatDate = (dateString: string, formatStr: string) => {
    const date = new Date(dateString);
    if (preferences.calendarSystem === 'shamsi') {
      return formatJalali(date, formatStr, { locale: localeFaIRJalali });
    }
    return format(date, formatStr, { locale: lang === 'fa' ? localeFaIR : localeEnUS });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ` ${currency}`;
  };

  const handleViewDescription = (transaction: ExpenseRecord) => {
    setSelectedTransaction(transaction);
    setIsDescriptionDialogOpen(true);
  };

  const handleDeleteConfirmation = (transaction: ExpenseRecord) => {
    setTransactionToDelete(transaction);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (transactionToDelete) {
      setTransactions(prev => prev.filter(tx => tx.id !== transactionToDelete.id));
      // Here you would also call an API to delete the transaction from the backend
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
       // TODO: Add toast notification for successful deletion
    }
  };

  return (
    <div className="space-y-6 rtl">
      <h1 className="text-3xl font-bold tracking-tight">{t('allTransactions')}</h1>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>{t('transactionList')}</CardTitle>
          <CardDescription>{t('transactionListDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>{t('productName')}</TableHead>
                  <TableHead className="text-center">{t('amount')}</TableHead>
                  <TableHead className="text-center">{t('date')}</TableHead>
                  <TableHead className="text-center">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, index) => (
                  <TableRow key={tx.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{tx.productName}</TableCell>
                    <TableCell className="text-center">{formatCurrency(tx.cost, tx.currency)}</TableCell>
                    <TableCell className="text-center">{effectiveFormatDate(tx.date, 'yyyy/MM/dd')}</TableCell>
                    <TableCell className="text-center space-x-1 rtl:space-x-reverse">
                      {tx.description && (
                        <Button variant="ghost" size="icon" onClick={() => handleViewDescription(tx)} aria-label={t('viewDescription')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirmation(tx)} className="text-destructive hover:text-destructive/80" aria-label={t('deleteTransaction')}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mb-2" />
              <p className="text-lg">{t('noTransactionsYet')}</p>
              <p className="text-sm">{t('addSomeTransactions')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Description Dialog */}
      <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
        <DialogContent dir={lang === 'fa' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{t('transactionDetails')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p><strong>{t('productName')}:</strong> {selectedTransaction?.productName}</p>
            <p><strong>{t('amount')}:</strong> {selectedTransaction && formatCurrency(selectedTransaction.cost, selectedTransaction.currency)}</p>
            <p><strong>{t('date')}:</strong> {selectedTransaction && effectiveFormatDate(selectedTransaction.date, 'PPP')}</p>
            <p><strong>{t('category')}:</strong> {selectedTransaction?.category}</p>
            {selectedTransaction?.description && (
              <p><strong>{t('description')}:</strong> {selectedTransaction.description}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t('close')}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent dir={lang === 'fa' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{t('confirmDeletion')}</DialogTitle>
            <DialogDescription>
              {t('confirmDeletionMessage', { name: transactionToDelete?.productName || ''})}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>{t('cancel')}</Button>
            <Button variant="destructive" onClick={handleDelete}>{t('delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
