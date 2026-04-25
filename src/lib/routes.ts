export type Locale = 'en' | 'ru';

export type PageKey =
  | 'home'
  | 'products'
  | 'vpn-bot'
  | 'autoposter'
  | 'about'
  | 'contact'
  | 'faq'
  | 'status'
  | 'coming-soon'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'data-deletion'
  | 'review-tiktok'
  | 'review-tiktok-login'
  | 'review-tiktok-callback'
  | 'review-tiktok-dashboard'
  | 'review-meta'
  | 'review-meta-login'
  | 'review-meta-callback'
  | 'review-meta-dashboard';

export type RouteDefinition = {
  key: PageKey;
  locale: Locale;
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
};

const join = (...parts: string[]) => parts.filter(Boolean).join('/');

export const routePaths: Record<Locale, Record<PageKey, string>> = {
  en: {
    home: '',
    products: join('products'),
    'vpn-bot': join('products', 'vpn-bot'),
    autoposter: join('products', 'autoposter'),
    about: join('about'),
    contact: join('contact'),
    faq: join('faq'),
    status: join('status'),
    'coming-soon': join('coming-soon'),
    'privacy-policy': join('privacy-policy'),
    'terms-of-service': join('terms-of-service'),
    'data-deletion': join('data-deletion'),
    'review-tiktok': join('review', 'tiktok'),
    'review-tiktok-login': join('review', 'tiktok', 'login'),
    'review-tiktok-callback': join('review', 'tiktok', 'callback'),
    'review-tiktok-dashboard': join('review', 'tiktok', 'dashboard'),
    'review-meta': join('review', 'meta'),
    'review-meta-login': join('review', 'meta', 'login'),
    'review-meta-callback': join('review', 'meta', 'callback'),
    'review-meta-dashboard': join('review', 'meta', 'dashboard')
  },
  ru: {
    home: 'ru',
    products: join('ru', 'products'),
    'vpn-bot': join('ru', 'products', 'vpn-bot'),
    autoposter: join('ru', 'products', 'autoposter'),
    about: join('ru', 'about'),
    contact: join('ru', 'contact'),
    faq: join('ru', 'faq'),
    status: join('ru', 'status'),
    'coming-soon': join('ru', 'coming-soon'),
    'privacy-policy': join('ru', 'privacy-policy'),
    'terms-of-service': join('ru', 'terms-of-service'),
    'data-deletion': join('ru', 'data-deletion'),
    'review-tiktok': join('ru', 'review', 'tiktok'),
    'review-tiktok-login': join('ru', 'review', 'tiktok', 'login'),
    'review-tiktok-callback': join('ru', 'review', 'tiktok', 'callback'),
    'review-tiktok-dashboard': join('ru', 'review', 'tiktok', 'dashboard'),
    'review-meta': join('ru', 'review', 'meta'),
    'review-meta-login': join('ru', 'review', 'meta', 'login'),
    'review-meta-callback': join('ru', 'review', 'meta', 'callback'),
    'review-meta-dashboard': join('ru', 'review', 'meta', 'dashboard')
  }
};

export const canonicalUrl = (locale: Locale, key: PageKey) => {
  const route = routePaths[locale][key];
  return route ? `/${route}` : '/';
};

export const locales: Locale[] = ['en', 'ru'];

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  ru: 'RU'
};
