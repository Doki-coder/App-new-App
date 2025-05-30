
'use client';

import { useUser } from './use-user';
import { translations, type TranslationKey as OriginalTranslationKey } from '@/lib/localization';

// Allow for specific keys that might use placeholders, or fall back to original keys
type TranslationKeyWithPlaceholders =
  | OriginalTranslationKey
  | 'confirmDeletionMessage';

export type TranslationKey = OriginalTranslationKey;


export const useTranslation = () => {
  const { preferences } = useUser();
  const currentTranslations = translations[preferences.language] || translations.fa;

  const t = (key: TranslationKeyWithPlaceholders, params?: Record<string, string | number>): string => {
    let translation = currentTranslations[key as OriginalTranslationKey] || translations.fa[key as OriginalTranslationKey] || String(key);
    if (params) {
      Object.keys(params).forEach(paramKey => {
        // Ensure placeholder exists to avoid replacing parts of other words
        const placeholderRegExp = new RegExp(`{${paramKey}}`, 'g');
        if (placeholderRegExp.test(translation)) {
          translation = translation.replace(placeholderRegExp, String(params[paramKey]));
        }
      });
    }
    return translation;
  };

  return { t, lang: preferences.language };
};
