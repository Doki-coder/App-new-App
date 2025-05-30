'use client';
import type React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CURRENCIES } from '@/lib/constants';
import type { Currency } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (value: Currency) => void;
  disabled?: boolean;
}

export default function CurrencySelector({ value, onChange, disabled }: CurrencySelectorProps) {
  const { t } = useTranslation();
  return (
    <Select
      onValueChange={(val: Currency) => onChange(val)}
      defaultValue={value}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={t('selectCurrency')} />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map(currency => (
          <SelectItem key={currency.value} value={currency.value}>
            {currency.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
