'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import CurrencySelector from '@/components/shared/currency-selector';
import LanguageSelector from '@/components/shared/language-selector';
import { THEMES, CURRENCIES, LANGUAGES, CALENDAR_SYSTEMS } from '@/lib/constants';
import type { Currency, Language, Theme, CalendarSystem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const settingsFormSchema = z.object({
  name: z.string().min(2, { message: 'نام باید حداقل ۲ حرف داشته باشد.' }),
  currency: z.custom<Currency>(val => CURRENCIES.some(c => c.value === val), {
    message: 'ارز نامعتبر انتخاب شده است.',
  }),
  language: z.custom<Language>(val => LANGUAGES.some(l => l.value === val), {
    message: 'زبان نامعتبر انتخاب شده است.',
  }),
  theme: z.custom<Theme>(val => THEMES.some(t => t.value === val), {
    message: 'پوسته نامعتبر انتخاب شده است.',
  }),
  calendarSystem: z.custom<CalendarSystem>(val => CALENDAR_SYSTEMS.some(cs => cs.value === val), {
    message: 'سیستم تقویم نامعتبر انتخاب شده است.',
  }),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { preferences, updateName, updateCurrency, updateLanguage, updateTheme, updateCalendarSystem } = useUser();
  const { toast } = useToast();
  const { t, lang } = useTranslation();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      name: preferences.name,
      currency: preferences.currency,
      language: preferences.language,
      theme: preferences.theme,
      calendarSystem: preferences.calendarSystem,
    },
    values: preferences 
  });

  function onSubmit(data: SettingsFormValues) {
    updateName(data.name);
    updateCurrency(data.currency);
    updateLanguage(data.language);
    updateTheme(data.theme);
    updateCalendarSystem(data.calendarSystem);
    toast({
      title: t('settingsSaved'),
      description: t('profile') + ' شما با موفقیت به روز شد.', // Concatenating for simplicity, ideally a separate translation key.
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('settingsTitle')}</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{t('profile')}</CardTitle>
          <CardDescription>
            تنظیمات شخصی و نمایش برنامه خود را مدیریت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('yourName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('yourNamePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('preferredCurrency')}</FormLabel>
                    <CurrencySelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('preferredLanguage')}</FormLabel>
                    <LanguageSelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t('theme')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4 sm:gap-x-4"
                        dir={lang === 'fa' ? 'rtl' : 'ltr'}
                      >
                        {THEMES.map((themeOption) => (
                           <FormItem key={themeOption.value} className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                             <FormControl>
                               <RadioGroupItem value={themeOption.value} id={`theme-${themeOption.value}`} />
                             </FormControl>
                             <FormLabel htmlFor={`theme-${themeOption.value}`} className="font-normal">
                               {t(themeOption.label.toLowerCase() as 'light' | 'dark')}
                             </FormLabel>
                           </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="calendarSystem"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t('calendarSystem')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4 sm:gap-x-4"
                        dir={lang === 'fa' ? 'rtl' : 'ltr'}
                      >
                        {CALENDAR_SYSTEMS.map((systemOption) => (
                           <FormItem key={systemOption.value} className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                             <FormControl>
                               <RadioGroupItem value={systemOption.value} id={`calendar-${systemOption.value}`} />
                             </FormControl>
                             <FormLabel htmlFor={`calendar-${systemOption.value}`} className="font-normal">
                               {t(systemOption.labelKey)}
                             </FormLabel>
                           </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="shadow-md">{t('save')}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
