import type { Locale } from '@/lib/routes';

export const isLocale = (value: string | undefined): value is Locale => value === 'en' || value === 'ru';

export const localeFromPath = (path: string): Locale => (path.startsWith('ru') ? 'ru' : 'en');
