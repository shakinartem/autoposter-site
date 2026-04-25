import type { Locale, PageKey } from '@/lib/routes';
import { allPageKeys, getRouteMeta } from '@/content/pages';
import { routePaths } from '@/lib/routes';

export type ManifestEntry = {
  key: PageKey;
  locale: Locale;
  path: string;
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
};

const buildEntry = (key: PageKey, locale: Locale): ManifestEntry => {
  const meta = getRouteMeta(key, locale);

  return {
    key,
    locale,
    path: routePaths[locale][key],
    title: meta.title,
    description: meta.description,
    canonical: meta.canonical,
    noindex: meta.noindex
  };
};

export const manifest: ManifestEntry[] = allPageKeys.flatMap((key) =>
  (['en', 'ru'] as Locale[]).map((locale) => buildEntry(key, locale))
);

export const manifestByPath = new Map(manifest.map((entry) => [entry.path || '/', entry]));
