'use client';
import type React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LANGUAGES } from '@/lib/constants';
import type { Language } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

interface LanguageSelectorProps {
  value: Language;
  onChange: (value: Language) => void;
  disabled?: boolean;
}

export default function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
  const { t } = useTranslation();
  return (
    <Select
      onValueChange={(val: Language) => onChange(val)}
      defaultValue={value}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={t('selectLanguage')} />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map(lang => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
