'use client';

import { useState, useEffect } from 'react';
import { Locale, defaultLocale } from './config';

let translations: Record<string, any> = {};

export async function loadTranslations(locale: Locale) {
  try {
    const response = await fetch(`/locales/${locale}/translation.json`);
    const data = await response.json();
    translations = data;
    return data;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    return {};
  }
}

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedLocale = localStorage.getItem('locale') as Locale;
    const initialLocale = storedLocale || defaultLocale;
    
    loadTranslations(initialLocale).then(() => {
      setLocale(initialLocale);
      setIsLoading(false);
    });

    const handleLanguageChange = (event: CustomEvent) => {
      const newLocale = event.detail as Locale;
      loadTranslations(newLocale).then(() => {
        setLocale(newLocale);
        document.documentElement.lang = newLocale;
        document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
      });
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { t, locale, isLoading };
}