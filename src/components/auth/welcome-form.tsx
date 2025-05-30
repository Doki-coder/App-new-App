'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser } from '@/hooks/use-user';
import { CURRENCIES, LANGUAGES, DEFAULT_USER_PREFERENCES } from '@/lib/constants';
import type { Currency, Language } from '@/types';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'نام باید حداقل ۲ حرف داشته باشد.' }),
  currency: z.custom<Currency>(val => CURRENCIES.some(c => c.value === val), {
    message: 'ارز نامعتبر انتخاب شده است.',
  }),
  language: z.custom<Language>(val => LANGUAGES.some(l => l.value === val), {
    message: 'زبان نامعتبر انتخاب شده است.',
  }),
});

type WelcomeFormValues = z.infer<typeof formSchema>;

export default function WelcomeForm() {
  const router = useRouter();
  const { preferences, completeFirstLaunch } = useUser();
  const { toast } = useToast();

  const form = useForm<WelcomeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: preferences.name || '',
      currency: preferences.currency || DEFAULT_USER_PREFERENCES.currency,
      language: preferences.language || DEFAULT_USER_PREFERENCES.language,
    },
  });

  function onSubmit(values: WelcomeFormValues) {
    completeFirstLaunch(values.name, values.currency, values.language);
    toast({
      title: "خوش آمدید!",
      description: `حساب شما با موفقیت برای ${values.name} تنظیم شد.`,
    });
    router.push('/dashboard');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام شما</FormLabel>
              <FormControl>
                <Input placeholder="مثلا: علی رضایی" {...field} />
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
              <FormLabel>ارز مورد استفاده</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="یک ارز انتخاب کنید" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CURRENCIES.map(currency => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>زبان برنامه</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="یک زبان انتخاب کنید" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          شروع کنید
        </Button>
      </form>
    </Form>
  );
}
