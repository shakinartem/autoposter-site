import type { Locale, PageKey } from '@/lib/routes';
import { canonicalUrl, routePaths } from '@/lib/routes';

const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://spgutils.ru';
const apiBaseUrl = 'https://api.spgutils.ru';
const apiUrl = (path: string) => `${apiBaseUrl}${path}`;

export type Cta = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export type Hero = {
  eyebrow: string;
  title: string;
  lead: string;
  primary: Cta;
  secondary?: Cta;
  note?: string;
};

export type Stat = { label: string; value: string; detail?: string };
export type Feature = { title: string; body: string; tag?: string };
export type Step = { title: string; body: string };
export type Checklist = { title: string; items: string[] };
export type LinkCard = { title: string; body: string; href: string; label: string };

export type PageContent = {
  title: string;
  description: string;
  hero?: Hero;
  spotlights?: LinkCard[];
  stats?: Stat[];
  features?: Feature[];
  steps?: Step[];
  checklist?: Checklist[];
  cards?: LinkCard[];
  article?: { heading: string; body: string[]; bullets?: string[] }[];
  faq?: { q: string; a: string }[];
  status?: { label: string; value: string; tone: 'ok' | 'warn' | 'neutral' }[];
  matrix?: { name: string; supported: string; inProgress: string; planned: string }[];
  review?: {
    problem: string;
    permissions: string[];
    flow: string[];
    capabilities: string[];
    notes: string[];
  };
  footerNote?: string;
  noindex?: boolean;
};

type PageBundle = Record<Locale, PageContent>;

const supportEmail = 'support@spgutils.ru';
const statusEmail = 'status@spgutils.ru';

const home: PageBundle = {
  en: {
    title: 'SPG Utils | Premium utility platform for bots and SaaS tools',
    description:
      'SPG Utils is a dark, premium utility platform for monetized bots, SaaS tools, and review-ready product pages.',
    hero: {
      eyebrow: 'Premium utility platform',
      title: 'A focused home for bots, SaaS tools, and review-ready product pages.',
      lead:
        'SPG Utils is built to become the main entry point for monetized utilities, app review flows, and future product launches without turning into a bloated SaaS shell.',
      primary: { label: 'Review', href: '/review' },
      secondary: { label: 'Review', href: '/review', variant: 'secondary' },
      note: 'Static-first frontend. Worker-backed auth flows. Clear paths for future products.'
    },
    spotlights: [
      {
        title: 'TikTok review hub',
        body: 'Public review and testing surface with Telegram-first account linking and server-side OAuth handling.',
        href: '/review',
        label: 'Open review'
      },
      {
        title: 'Meta review hub',
        body: 'Public review and testing surface with Telegram-first account linking and server-side OAuth handling.',
        href: '/review',
        label: 'Open review'
      }
    ],
    stats: [
      { label: 'Frontend', value: 'Astro static-first', detail: 'Fast pages, clean SEO, simple deployments.' },
      { label: 'Backend', value: 'Cloudflare Worker', detail: 'OAuth, callbacks, state, and deletion.' },
      { label: 'Storage', value: 'D1 + KV', detail: 'Durable account metadata and ephemeral state.' },
      { label: 'Locales', value: 'EN / RU', detail: 'English default with route-based localization.' }
    ],
    features: [
      {
        title: 'Review-ready by design',
        body:
          'Public pages, legal pages, and platform-specific review flows are separated so reviewers see the right thing without exposing tokens or internal admin logic.'
      },
      {
        title: 'Monetization foundation',
        body:
          'The structure is already prepared for pricing, subscriptions, access requests, lead capture, and future product directories.'
      },
      {
        title: 'Future platform expansion',
        body:
          'The site can absorb new utilities, new consoles, and platform-specific product pages without a redesign or route rewrite.'
      }
    ],
    cards: [
      { title: 'VPN Bot', body: 'Subscription-style utility product with a direct value proposition.', href: '/products/vpn-bot', label: 'Open product page' },
      { title: 'Autoposter', body: 'Private beta product concept for scheduling and multi-platform publishing.', href: '/products/autoposter', label: 'Request access' },
      { title: 'Review', body: 'A single OAuth entry point for TikTok and Meta review submission.', href: '/review', label: 'Open review page' },
      { title: 'Review docs', body: 'Public review, testing, and legal context live behind one entry page.', href: '/review', label: 'Open review page' }
    ],
    footerNote: 'No client secret is ever placed in the frontend. All sensitive exchanges happen in the Worker.'
  },
  ru: {
    title: 'SPG Utils | Платформа утилит для ботов и SaaS-инструментов',
    description:
      'SPG Utils — это тёмная премиальная платформа для монетизируемых ботов, SaaS-утилит и review-ready страниц.',
    hero: {
      eyebrow: 'Премиальная платформа утилит',
      title: 'Дом для ботов, SaaS-инструментов и review-ready страниц.',
      lead:
        'SPG Utils создаётся как основная точка входа для монетизируемых утилит, review-flows и будущих запусков продуктов без раздувания инфраструктуры.',
      primary: { label: 'Review', href: '/ru/review' },
      secondary: { label: 'Review', href: '/ru/review', variant: 'secondary' },
      note: 'Static-first frontend. Worker для auth. Готовность к расширению.'
    },
    spotlights: [
      {
        title: 'TikTok review hub',
        body: 'Публичная review/testing поверхность с Telegram-first linking и server-side OAuth.',
        href: '/ru/review',
        label: 'Открыть review'
      },
      {
        title: 'Meta review hub',
        body: 'Публичная review/testing поверхность с Telegram-first linking и server-side OAuth.',
        href: '/ru/review',
        label: 'Открыть review'
      }
    ],
    stats: [
      { label: 'Frontend', value: 'Astro static-first', detail: 'Быстро, SEO-friendly, просто в деплое.' },
      { label: 'Backend', value: 'Cloudflare Worker', detail: 'OAuth, callbacks, state, deletion.' },
      { label: 'Storage', value: 'D1 + KV', detail: 'Долговременные записи и временное состояние.' },
      { label: 'Locales', value: 'EN / RU', detail: 'Английский по умолчанию, русский через маршруты.' }
    ],
    features: [
      {
        title: 'Готовность к review',
        body:
          'Публичные страницы, legal-разделы и review flow разделены, чтобы проверяющие видели нужный путь без токенов и внутренних админ-деталей.'
      },
      {
        title: 'Основа для монетизации',
        body:
          'Структура уже подготовлена для цен, подписок, заявок на доступ, лид-форм и будущего каталога продуктов.'
      },
      {
        title: 'Расширение под платформы',
        body:
          'Сайт можно расширять новыми утилитами и платформенными страницами без переделки архитектуры и роутинга.'
      }
    ],
    cards: [
      { title: 'VPN Bot', body: 'Подписочная utility-утилита с чёткой ценностью.', href: '/ru/products/vpn-bot', label: 'Открыть страницу' },
      { title: 'Autoposter', body: 'Private beta для планирования и кросс-постинга.', href: '/ru/products/autoposter', label: 'Request access' },
      { title: 'Review', body: 'Единая OAuth-точка входа для TikTok и Meta review.', href: '/ru/review', label: 'Открыть review page' },
      { title: 'Review docs', body: 'Публичные review, testing и legal сведения собраны на одной странице.', href: '/ru/review', label: 'Открыть review page' }
    ],
    footerNote: 'Client secret никогда не попадает во frontend. Все чувствительные обмены проходят в Worker.'
  }
};

const products: PageBundle = {
  en: {
    title: 'Products | SPG Utils',
    description: 'Explore SPG Utils products, current launches, and upcoming platform utilities.',
    hero: {
      eyebrow: 'Products',
      title: 'Utility products with clear entry points and room to grow.',
      lead:
        'The product layer is intentionally simple, so each new tool can launch cleanly without being trapped inside a one-off landing page.',
      primary: { label: 'VPN Bot', href: '/products/vpn-bot' },
      secondary: { label: 'Autoposter', href: '/products/autoposter', variant: 'secondary' }
    },
    cards: [
      { title: 'VPN Bot', body: 'Convenience-focused subscription utility with a direct value proposition.', href: '/products/vpn-bot', label: 'Open' },
      { title: 'Autoposter', body: 'Scheduling, queue, and cross-posting concept for multi-platform publishing.', href: '/products/autoposter', label: 'Open' },
      { title: 'Future products', body: 'Reserve space for new tools, pricing, and access flows.', href: '/coming-soon', label: 'See scaffold' }
    ]
  },
  ru: {
    title: 'Продукты | SPG Utils',
    description: 'Продукты SPG Utils, текущие запускаемые решения и будущие утилиты платформы.',
    hero: {
      eyebrow: 'Продукты',
      title: 'Утилиты с понятным входом и запасом для роста.',
      lead:
        'Слой продуктов специально сделан простым, чтобы каждый новый инструмент мог запускаться чисто и не был заперт в одноразовом лендинге.',
      primary: { label: 'VPN Bot', href: '/ru/products/vpn-bot' },
      secondary: { label: 'Autoposter', href: '/ru/products/autoposter', variant: 'secondary' }
    },
    cards: [
      { title: 'VPN Bot', body: 'Подписочная utility-утилита с чёткой ценностью.', href: '/ru/products/vpn-bot', label: 'Открыть' },
      { title: 'Autoposter', body: 'Концепт планирования, очереди и кросс-постинга.', href: '/ru/products/autoposter', label: 'Открыть' },
      { title: 'Будущие продукты', body: 'Место для новых инструментов, цен и access flows.', href: '/ru/coming-soon', label: 'Смотреть' }
    ]
  }
};

const vpnBot: PageBundle = {
  en: {
    title: 'VPN Bot | SPG Utils',
    description: 'A subscription-ready VPN bot product page focused on convenience, utility, and fast access.',
    hero: {
      eyebrow: 'VPN Bot',
      title: 'Fast access, simple usage, and a subscription model that feels like a utility.',
      lead:
        'This page is structured to sell the product honestly: quick access, low friction, and a clean experience for users who want the tool to just work.',
      primary: { label: 'Request access', href: '/contact' },
      secondary: { label: 'Learn about SPG Utils', href: '/about', variant: 'secondary' },
      note: 'No impossible claims. Just practical utility and a straightforward CTA.'
    },
    stats: [
      { label: 'Access', value: 'Fast setup', detail: 'Clear onboarding and immediate next step.' },
      { label: 'Model', value: 'Subscription', detail: 'Designed for recurring utility value.' },
      { label: 'Focus', value: 'Convenience', detail: 'Simple UI and low-friction user flow.' },
      { label: 'State', value: 'Production-ready page', detail: 'Prepared for a real launch, not a placeholder.' }
    ],
    features: [
      {
        title: 'Convenience first',
        body:
          'The proposition is speed and clarity. Users can understand the offer quickly and move from interest to access without confusion.'
      },
      {
        title: 'Subscription-friendly',
        body:
          'The page is ready for pricing blocks, plan comparisons, and billing integration when you are ready to add them.'
      },
      {
        title: 'Simple support path',
        body:
          'Contact and FAQ links make the product feel operational, which matters for trust and for future monetization.'
      }
    ],
    checklist: [
      {
        title: 'What the page should communicate',
        items: ['Fast access', 'Practical utility', 'Subscription availability', 'Straightforward onboarding', 'No exaggerated promises']
      }
    ],
    footerNote: 'Future pricing and checkout sections can be added without changing the base page architecture.'
  },
  ru: {
    title: 'VPN Bot | SPG Utils',
    description: 'Страница VPN Bot с фокусом на удобство, utility и быструю выдачу доступа.',
    hero: {
      eyebrow: 'VPN Bot',
      title: 'Быстрый доступ, простое использование и подписочная модель как у полезного инструмента.',
      lead:
        'Страница построена честно: быстрый доступ, низкий порог входа и чистый опыт для пользователей, которым нужен инструмент, который просто работает.',
      primary: { label: 'Запросить доступ', href: '/ru/contact' },
      secondary: { label: 'О SPG Utils', href: '/ru/about', variant: 'secondary' },
      note: 'Без невозможных обещаний. Только практичная utility-ценность.'
    },
    stats: [
      { label: 'Доступ', value: 'Быстрый старт', detail: 'Простое онбординг-движение.' },
      { label: 'Модель', value: 'Подписка', detail: 'Сделано под регулярную ценность.' },
      { label: 'Фокус', value: 'Удобство', detail: 'Понятный UI и низкая friction.' },
      { label: 'Статус', value: 'Production-ready страница', detail: 'Не заглушка, а база для релиза.' }
    ],
    features: [
      {
        title: 'Сначала удобство',
        body:
          'Пользователь должен быстро понять ценность и пройти путь от интереса к доступу без лишних шагов и путаницы.'
      },
      {
        title: 'Готово к подписке',
        body:
          'Страница уже готова под блоки цен, планы и биллинг, когда вы будете добавлять их в проект.'
      },
      {
        title: 'Путь поддержки',
        body:
          'Контакты и FAQ создают ощущение работающего продукта, что важно и для доверия, и для монетизации.'
      }
    ],
    checklist: [
      {
        title: 'Что должна передавать страница',
        items: ['Быстрый доступ', 'Практическую ценность', 'Подписку', 'Простой онбординг', 'Без завышенных обещаний']
      }
    ],
    footerNote: 'Блоки цен и checkout можно добавить позже без переделки базовой архитектуры.'
  }
};

const autoposter: PageBundle = {
  en: {
    title: 'Autoposter | SPG Utils',
    description: 'Private beta autoposter platform for scheduled publishing, queues, and cross-posting.',
    hero: {
      eyebrow: 'Autoposter',
      title: 'Private beta autoposter with scheduling, queues, and multi-platform publishing.',
      lead:
        'This page is intentionally framed like a real product in development: accessible, specific, and honest about what is supported now versus what is planned.',
      primary: { label: 'Request access', href: '/contact' },
      secondary: { label: 'Review flow', href: '/review', variant: 'secondary' },
      note: 'Supported, in progress, and planned platforms are stated clearly.'
    },
    stats: [
      { label: 'Mode', value: 'Private beta', detail: 'Request-based access and controlled onboarding.' },
      { label: 'Core', value: 'Scheduling + queue', detail: 'Content planning and status visibility.' },
      { label: 'Scope', value: 'Multi-platform', detail: 'Platform support is labeled honestly.' },
      { label: 'UX', value: 'Dashboard-ready', detail: 'Built like a real control surface.' }
    ],
    matrix: [
      { name: 'Telegram', supported: 'Supported', inProgress: 'Queue sync improvements', planned: 'Team workspaces' },
      { name: 'VK', supported: 'In progress', inProgress: 'Publishing workflow', planned: 'Rules-based automation' },
      { name: 'TikTok', supported: 'Planned', inProgress: 'Review readiness', planned: 'Publishing pipeline' },
      { name: 'Instagram', supported: 'Planned', inProgress: 'Permission mapping', planned: 'Posting workflows' },
      { name: 'Facebook', supported: 'Planned', inProgress: 'Account connection design', planned: 'Page publishing' },
      { name: 'Threads', supported: 'Planned', inProgress: 'API constraints analysis', planned: 'Posting automation' },
      { name: 'Odnoklassniki', supported: 'Planned', inProgress: 'Platform feasibility', planned: 'Queue integration' },
      { name: 'Yandex Zen', supported: 'Planned', inProgress: 'Content format mapping', planned: 'Publishing support' }
    ],
    steps: [
      { title: 'Connect accounts', body: 'Link the platforms you actually want to publish to.' },
      { title: 'Build a queue', body: 'Schedule content and monitor the queue in one dashboard.' },
      { title: 'Review status', body: 'See what is supported now, what is in progress, and what is planned.' }
    ],
    features: [
      {
        title: 'Content scheduling',
        body:
          'Plan publishing ahead of time without pretending that every platform allows the same API behavior or feature set.'
      },
      {
        title: 'Cross-posting',
        body:
          'Reuse a piece of content across multiple destinations while respecting each platform’s actual capability boundary.'
      },
      {
        title: 'Status-driven dashboard',
        body:
          'A queue, account connections, and publishing status give the product a real control-center feeling, which is important for trust.'
      }
    ],
    footerNote: 'Supported / in progress / planned labels are explicit so the page stays honest during review and launch.'
  },
  ru: {
    title: 'Autoposter | SPG Utils',
    description: 'Private beta автопостера для планирования публикаций, очередей и кросс-постинга.',
    hero: {
      eyebrow: 'Autoposter',
      title: 'Private beta автопостер с планированием, очередью и мультиплатформенной публикацией.',
      lead:
        'Страница намеренно выглядит как реальный продукт в разработке: конкретно, честно и без попытки выдать неподдерживаемые функции за готовые.',
      primary: { label: 'Запросить доступ', href: '/ru/contact' },
      secondary: { label: 'Review flow', href: '/ru/review', variant: 'secondary' },
      note: 'Статусы supported / in progress / planned показаны явно.'
    },
    stats: [
      { label: 'Режим', value: 'Private beta', detail: 'Доступ по запросу и контролируемый онбординг.' },
      { label: 'Core', value: 'Планирование + очередь', detail: 'Планирование контента и видимый статус.' },
      { label: 'Scope', value: 'Multi-platform', detail: 'Поддержка платформ обозначена честно.' },
      { label: 'UX', value: 'Dashboard-ready', detail: 'Похоже на настоящий control center.' }
    ],
    matrix: [
      { name: 'Telegram', supported: 'Supported', inProgress: 'Улучшение синка очереди', planned: 'Командные пространства' },
      { name: 'VK', supported: 'In progress', inProgress: 'Публикационный workflow', planned: 'Правила автоматизации' },
      { name: 'TikTok', supported: 'Planned', inProgress: 'Review readiness', planned: 'Пайплайн публикации' },
      { name: 'Instagram', supported: 'Planned', inProgress: 'Карта permissions', planned: 'Постинг workflows' },
      { name: 'Facebook', supported: 'Planned', inProgress: 'Дизайн подключения аккаунта', planned: 'Публикация в Pages' },
      { name: 'Threads', supported: 'Planned', inProgress: 'Анализ ограничений API', planned: 'Автоматизация постинга' },
      { name: 'Odnoklassniki', supported: 'Planned', inProgress: 'Оценка feasibility', planned: 'Интеграция очереди' },
      { name: 'Yandex Zen', supported: 'Planned', inProgress: 'Маппинг форматов', planned: 'Поддержка публикаций' }
    ],
    steps: [
      { title: 'Подключить аккаунты', body: 'Привязать платформы, куда действительно нужно публиковать.' },
      { title: 'Собрать очередь', body: 'Планировать контент и следить за статусом в одном dashboard.' },
      { title: 'Проверить статус', body: 'Видеть, что уже поддерживается, что в разработке, а что только планируется.' }
    ],
    features: [
      {
        title: 'Планирование контента',
        body:
          'Публикации планируются заранее без попытки объявить поддержку там, где API и реальные возможности платформы этого не позволяют.'
      },
      {
        title: 'Cross-posting',
        body:
          'Одна единица контента может расходиться по нескольким каналам с учётом реальных ограничений каждой платформы.'
      },
      {
        title: 'Dashboard на статусах',
        body:
          'Очередь, подключения аккаунтов и статус публикации делают продукт похожим на настоящий control center.'
      }
    ],
    footerNote: 'Маркировка supported / in progress / planned сделана явно, чтобы страница была честной при review и релизе.'
  }
};

const about: PageBundle = {
  en: {
    title: 'About | SPG Utils',
    description: 'Learn how SPG Utils is structured as a foundation for bots, SaaS tools, and future products.',
    hero: {
      eyebrow: 'About',
      title: 'Built as a foundation, not a one-off landing page.',
      lead:
        'SPG Utils is meant to survive beyond the first product launch. The architecture, routing, and content model all leave room for future tools, future platforms, and future review submissions.',
      primary: { label: 'View products', href: '/products' },
      secondary: { label: 'Contact', href: '/contact', variant: 'secondary' }
    },
    article: [
      {
        heading: 'What SPG Utils is',
        body: [
          'A premium utility platform that gives your bots and SaaS tools a serious public home.',
          'A review-ready surface for TikTok and Meta that keeps auth logic in the Worker and out of the browser.',
          'A base for future monetization, lead capture, and product expansion.'
        ]
      },
      {
        heading: 'What it is not',
        body: ['Not a disposable template.', 'Not a fake SaaS backend.', 'Not a noisy marketing page pretending to be a product.']
      }
    ]
  },
  ru: {
    title: 'О проекте | SPG Utils',
    description: 'Как SPG Utils устроен как основа для ботов, SaaS и будущих продуктов.',
    hero: {
      eyebrow: 'О проекте',
      title: 'Построено как foundation, а не как одноразовый лендинг.',
      lead:
        'SPG Utils задуман так, чтобы жить дольше первого продукта. Архитектура, роутинг и content model оставляют место для новых утилит, новых платформ и новых review submissions.',
      primary: { label: 'Смотреть продукты', href: '/ru/products' },
      secondary: { label: 'Контакты', href: '/ru/contact', variant: 'secondary' }
    },
    article: [
      {
        heading: 'Что такое SPG Utils',
        body: [
          'Премиальная платформа утилит, которая даёт ботам и SaaS-инструментам серьёзный публичный дом.',
          'Review-ready поверхность для TikTok и Meta, где auth-логика живёт в Worker, а не в браузере.',
          'Основа для монетизации, лид-капчуры и расширения продуктовой линейки.'
        ]
      },
      {
        heading: 'Чем это не является',
        body: ['Не одноразовый шаблон.', 'Не фейковый SaaS backend.', 'Не шумный маркетинг, притворяющийся продуктом.']
      }
    ]
  }
};

const contact: PageBundle = {
  en: {
    title: 'Contact | SPG Utils',
    description: 'Contact SPG Utils for product questions, review support, partnerships, or access requests.',
    hero: {
      eyebrow: 'Contact',
      title: 'Use the right channel for the right kind of request.',
      lead:
        'For review, support, or product access, keep the paths simple. This page is designed to feel operational rather than hidden behind a generic form.',
      primary: { label: 'Email support', href: `mailto:${supportEmail}` },
      secondary: { label: 'Data deletion', href: '/data-deletion', variant: 'secondary' }
    },
    cards: [
      { title: 'Support', body: `Questions about products, login flows, or access can go to ${supportEmail}.`, href: `mailto:${supportEmail}`, label: 'Send email' },
      { title: 'Status', body: `Operational notices and review flow issues can go to ${statusEmail}.`, href: `mailto:${statusEmail}`, label: 'Send notice' },
      { title: 'Review links', body: 'Review pages can be opened directly from the public site without exposing secrets.', href: '/review', label: 'Open review' }
    ]
  },
  ru: {
    title: 'Контакты | SPG Utils',
    description: 'Контакты SPG Utils для вопросов по продуктам, review-поддержке, партнёрству и доступу.',
    hero: {
      eyebrow: 'Контакты',
      title: 'Используйте правильный канал для правильного типа запроса.',
      lead:
        'Для review, поддержки и доступа к продуктам лучше сохранять простые и понятные пути. Страница сделана как рабочий канал, а не как спрятанная форма.',
      primary: { label: 'Написать в поддержку', href: `mailto:${supportEmail}` },
      secondary: { label: 'Удаление данных', href: '/ru/data-deletion', variant: 'secondary' }
    },
    cards: [
      { title: 'Поддержка', body: `Вопросы по продуктам, login-flow или доступу можно отправлять на ${supportEmail}.`, href: `mailto:${supportEmail}`, label: 'Написать' },
      { title: 'Статус', body: `Уведомления по работе сервиса и review flow можно отправлять на ${statusEmail}.`, href: `mailto:${statusEmail}`, label: 'Сообщить' },
      { title: 'Review-ссылки', body: 'Review-страницы доступны напрямую и не раскрывают секреты.', href: '/ru/review', label: 'Открыть review' }
    ]
  }
};

const faq: PageBundle = {
  en: {
    title: 'FAQ | SPG Utils',
    description: 'Answers about products, access, review flows, legal pages, and platform support.',
    hero: {
      eyebrow: 'FAQ',
      title: 'Short answers for the most important questions.',
      lead:
        'The FAQ intentionally covers product intent, review readiness, data handling, and the path for future expansion.',
      primary: { label: 'Contact', href: '/contact' },
      secondary: { label: 'Legal', href: '/privacy-policy', variant: 'secondary' }
    },
    faq: [
      { q: 'Is this a one-page landing?', a: 'No. It is a foundation for multiple products, legal pages, and review flows.' },
      { q: 'Where are secrets stored?', a: 'In Cloudflare Worker secrets and server-side storage, never in the frontend repository.' },
      { q: 'Can the site expand later?', a: 'Yes. The routing, content model, and Worker boundaries are built for future products.' },
      { q: 'Is English the default?', a: 'Yes. English is the default public language and the review language.' }
    ]
  },
  ru: {
    title: 'FAQ | SPG Utils',
    description: 'Ответы на вопросы о продуктах, доступе, review flows, legal-страницах и поддержке платформ.',
    hero: {
      eyebrow: 'FAQ',
      title: 'Короткие ответы на самые важные вопросы.',
      lead:
        'FAQ специально покрывает назначение продуктов, готовность к review, работу с данными и путь к будущему расширению.',
      primary: { label: 'Контакты', href: '/ru/contact' },
      secondary: { label: 'Legal', href: '/ru/privacy-policy', variant: 'secondary' }
    },
    faq: [
      { q: 'Это одностраничный лендинг?', a: 'Нет. Это основа для нескольких продуктов, legal-страниц и review flows.' },
      { q: 'Где хранятся секреты?', a: 'В Worker secrets и серверном хранилище, никогда не во frontend-репозитории.' },
      { q: 'Можно ли расширять сайт позже?', a: 'Да. Роутинг, content model и Worker boundaries уже подготовлены.' },
      { q: 'Английский язык по умолчанию?', a: 'Да. Английский — основной публичный язык и язык для review.' }
    ]
  }
};

const status: PageBundle = {
  en: {
    title: 'Status | SPG Utils',
    description: 'Operational status for public pages and review flows.',
    hero: {
      eyebrow: 'Status',
      title: 'Operational visibility for public pages and connected flows.',
      lead:
        'This page makes it easy to show whether the site, review entry points, and backend dependencies are healthy.',
      primary: { label: 'Check health', href: apiUrl('/api/health') },
      secondary: { label: 'Contact support', href: '/contact', variant: 'secondary' }
    },
    status: [
      { label: 'Frontend', value: 'Healthy', tone: 'ok' },
      { label: 'Worker API', value: 'Healthy when configured', tone: 'neutral' },
      { label: 'OAuth state', value: 'Stored server-side', tone: 'ok' },
      { label: 'Tokens', value: 'Never shown in browser', tone: 'ok' }
    ],
    footerNote: 'If a provider is down or misconfigured, this page should make the dependency obvious without exposing secrets.'
  },
  ru: {
    title: 'Статус | SPG Utils',
    description: 'Операционный статус публичных страниц и review flow.',
    hero: {
      eyebrow: 'Статус',
      title: 'Понятная видимость для публичных страниц и подключённых потоков.',
      lead:
        'Страница помогает быстро показать, что сайт, review entry points и backend-зависимости работают нормально.',
      primary: { label: 'Проверить health', href: apiUrl('/api/health') },
      secondary: { label: 'Связаться с поддержкой', href: '/ru/contact', variant: 'secondary' }
    },
    status: [
      { label: 'Frontend', value: 'Healthy', tone: 'ok' },
      { label: 'Worker API', value: 'Healthy when configured', tone: 'neutral' },
      { label: 'OAuth state', value: 'Хранится на сервере', tone: 'ok' },
      { label: 'Tokens', value: 'Не показываются в браузере', tone: 'ok' }
    ],
    footerNote: 'Если провайдер недоступен или не настроен, страница должна показать это без утечки секретов.'
  }
};

const comingSoon: PageBundle = {
  en: {
    title: 'Coming Soon | SPG Utils',
    description: 'A focused holding page for future products and platform launches.',
    hero: {
      eyebrow: 'Coming soon',
      title: 'New products, new platforms, same disciplined foundation.',
      lead:
        'This page is a safe place to point future launches at without exposing half-finished product logic or broken marketing claims.',
      primary: { label: 'Get in touch', href: '/contact' },
      secondary: { label: 'Browse products', href: '/products', variant: 'secondary' }
    }
  },
  ru: {
    title: 'Скоро | SPG Utils',
    description: 'Аккуратная заглушка для будущих продуктов и запусков платформ.',
    hero: {
      eyebrow: 'Скоро',
      title: 'Новые продукты, новые платформы, та же дисциплинированная основа.',
      lead:
        'Эта страница нужна, чтобы безопасно вести будущие запуски, не показывая недоделанную бизнес-логику и не делая слабых маркетинговых обещаний.',
      primary: { label: 'Связаться', href: '/ru/contact' },
      secondary: { label: 'Продукты', href: '/ru/products', variant: 'secondary' }
    }
  }
};

const privacy: PageBundle = {
  en: {
    title: 'Privacy Policy | SPG Utils',
    description: 'How SPG Utils handles OAuth data, tokens, logs, support messages, and retention.',
    hero: {
      eyebrow: 'Privacy Policy',
      title: 'How we collect, store, protect, and delete data.',
      lead:
        'This policy covers OAuth data, token handling, account metadata, logs, support communication, retention, deletion, and security practices.',
      primary: { label: 'Data deletion', href: '/data-deletion' },
      secondary: { label: 'Terms of service', href: '/terms-of-service', variant: 'secondary' }
    },
    article: [
      {
        heading: 'Information we collect',
        body: [
          'OAuth authorization codes, access tokens, refresh tokens, scopes, expiry metadata, and account identifiers required to connect an account.',
          'Telegram user IDs when an account is linked through the Telegram bot.',
          'Support messages that you send by email or through future contact channels.',
          'Operational logs that help us diagnose platform issues, security events, and callback failures.'
        ]
      },
      {
        heading: 'How we use it',
        body: [
          'To complete OAuth flows, maintain connected account status, and show non-sensitive status information on review dashboards.',
          'To associate a Telegram user with connected OAuth accounts when the bot is used as the main management interface.',
          'To respond to support requests and operate the service safely.',
          'To fulfill data deletion requests and preserve compliance records where required by law.'
        ]
      },
      {
        heading: 'Storage and retention',
        body: [
          'Tokens and account metadata are stored server-side only, using Cloudflare storage bindings and Worker secrets for encryption-related material.',
          'Telegram user linkage records are stored only as needed to operate the bot-driven account management flow.',
          'Ephemeral OAuth state is retained only long enough to complete the flow.',
          'Connected account records are retained while the account is active or until deletion is requested.'
        ]
      },
      {
        heading: 'Security',
        body: [
          'State validation, scoped access, and server-side token handling are used to reduce risk.',
          'Secrets are not committed to the repository and are never exposed to the browser.',
          'We do not intentionally log access tokens or refresh tokens.'
        ]
      }
    ],
    footerNote: 'This policy is a template for the live product and should be reviewed by counsel before launch.'
  },
  ru: {
    title: 'Политика конфиденциальности | SPG Utils',
    description: 'Как SPG Utils работает с OAuth-данными, токенами, логами, сообщениями поддержки и сроками хранения.',
    hero: {
      eyebrow: 'Privacy Policy',
      title: 'Как мы собираем, храним, защищаем и удаляем данные.',
      lead:
        'Эта политика покрывает OAuth-данные, работу с токенами, account metadata, логи, поддержку, сроки хранения, удаление и меры безопасности.',
      primary: { label: 'Удаление данных', href: '/ru/data-deletion' },
      secondary: { label: 'Terms of service', href: '/ru/terms-of-service', variant: 'secondary' }
    },
    article: [
      {
        heading: 'Какие данные мы собираем',
        body: [
          'Authorization code OAuth, access tokens, refresh tokens, scopes, expiry metadata и account identifiers, необходимые для подключения аккаунта.',
          'Telegram user IDs, если аккаунт подключается через Telegram bot.',
          'Сообщения в поддержку, отправленные по email или через будущие каналы связи.',
          'Операционные логи, помогающие диагностировать проблемы платформы, события безопасности и ошибки callback.'
        ]
      },
      {
        heading: 'Как мы это используем',
        body: [
          'Для завершения OAuth flow, поддержания статуса подключённого аккаунта и показа безопасной статус-информации на review dashboard.',
          'Для связывания Telegram user id с подключёнными OAuth-аккаунтами, когда бот используется как основная панель управления.',
          'Для ответа на запросы в поддержку и безопасной работы сервиса.',
          'Для выполнения запросов на удаление данных и хранения обязательной compliance-истории, если этого требует закон.'
        ]
      },
      {
        heading: 'Хранение и сроки',
        body: [
          'Токены и account metadata хранятся только на сервере, с использованием storage bindings Cloudflare и Worker secrets для материалов, связанных с шифрованием.',
          'Связки Telegram user id с подключёнными аккаунтами хранятся только настолько долго, насколько это нужно для bot-driven flow.',
          'Временное OAuth state живёт только столько, сколько нужно для завершения flow.',
          'Записи о подключённом аккаунте сохраняются пока аккаунт активен или до запроса на удаление.'
        ]
      },
      {
        heading: 'Безопасность',
        body: [
          'Используются проверка state, ограничение доступа по scope и серверная работа с токенами для снижения риска.',
          'Секреты не коммитятся в репозиторий и не показываются в браузере.',
          'Мы не логируем access token и refresh token намеренно.'
        ]
      }
    ],
    footerNote: 'Перед запуском этот текст должен быть проверен юристом.'
  }
};

const terms: PageBundle = {
  en: {
    title: 'Terms of Service | SPG Utils',
    description: 'Terms, acceptable use, third-party disclaimers, liability, and product usage readiness.',
    hero: {
      eyebrow: 'Terms of Service',
      title: 'Clear rules for access, usage, and third-party dependencies.',
      lead:
        'These terms describe the scope of the service, acceptable use, user responsibilities, third-party platform disclaimers, and liability limits.',
      primary: { label: 'Privacy policy', href: '/privacy-policy' },
      secondary: { label: 'Contact', href: '/contact', variant: 'secondary' }
    },
    article: [
      {
        heading: 'Scope of service',
        body: [
          'SPG Utils provides a public website, OAuth connection and posting workflow tools, and deletion endpoints for connected tools.',
          'Telegram bot is used as the main management interface for active account linking and publishing operations.',
          'Any future subscription, dashboard, or access-control features may be introduced as separate product layers.'
        ]
      },
      {
        heading: 'Acceptable use',
        body: [
          'You must not abuse login flows, attempt unauthorized access, or use the service in a way that violates platform rules or applicable law.',
          'You must provide accurate information for connected accounts and deletion requests.'
        ]
      },
      {
        heading: 'Third-party platform disclaimer',
        body: [
          'TikTok, Meta, Instagram, Facebook, Threads, VK, Telegram, Odnoklassniki, and Yandex Zen are third-party platforms with their own policies and API limitations.',
          'Availability of a page or flow does not guarantee that every platform permission or capability is currently approved.'
        ]
      },
      {
        heading: 'Termination and liability',
        body: [
          'We may suspend or terminate access to protect the service, comply with law, or stop abuse.',
          'The service is provided on an as-is basis to the extent permitted by law, and liability is limited to the maximum extent allowed.'
        ]
      }
    ],
    footerNote: 'The final legal text should be reviewed for your operating entity and jurisdiction.'
  },
  ru: {
    title: 'Условия использования | SPG Utils',
    description: 'Условия, допустимое использование, дисклеймеры по третьим платформам и ограничение ответственности.',
    hero: {
      eyebrow: 'Terms of Service',
      title: 'Понятные правила доступа, использования и зависимостей от платформ.',
      lead:
        'Эти условия описывают scope сервиса, допустимое использование, ответственность пользователя, дисклеймеры по третьим платформам и ограничения ответственности.',
      primary: { label: 'Политика конфиденциальности', href: '/ru/privacy-policy' },
      secondary: { label: 'Контакты', href: '/ru/contact', variant: 'secondary' }
    },
    article: [
      {
        heading: 'Scope сервиса',
        body: [
          'SPG Utils предоставляет публичный сайт, OAuth connection and posting workflow tools, а также endpoints для удаления данных подключаемых инструментов.',
          'Telegram bot используется как основная панель управления для активного подключения аккаунтов и публикаций.',
          'Любые будущие функции подписки, dashboard или access-control могут быть добавлены отдельным слоем продукта.'
        ]
      },
      {
        heading: 'Допустимое использование',
        body: [
          'Нельзя злоупотреблять login flow, пытаться получить несанкционированный доступ или использовать сервис в обход правил платформ и закона.',
          'Пользователь обязан предоставлять корректные данные для подключаемых аккаунтов и запросов на удаление.'
        ]
      },
      {
        heading: 'Дисклеймер по третьим платформам',
        body: [
          'TikTok, Meta, Instagram, Facebook, Threads, VK, Telegram, Odnoklassniki и Yandex Zen — это сторонние платформы со своими политиками и ограничениями API.',
          'Наличие страницы или flow не означает, что каждая permission или capability уже одобрена.'
        ]
      },
      {
        heading: 'Прекращение и ответственность',
        body: [
          'Мы можем приостановить или прекратить доступ для защиты сервиса, соблюдения закона или остановки злоупотреблений.',
          'Сервис предоставляется "как есть" в максимально допустимой законом степени, а ответственность ограничивается максимально допустимым образом.'
        ]
      }
    ],
    footerNote: 'Финальный legal-текст нужно проверить под ваше юрлицо и юрисдикцию.'
  }
};

const deletion: PageBundle = {
  en: {
    title: 'Data Deletion | SPG Utils',
    description: 'How to request deletion of connected account data and related records.',
    hero: {
      eyebrow: 'Data deletion',
      title: 'A clear path for deleting connected account data.',
      lead:
        'If you want data removed, you should have one obvious path that covers connected account metadata, tokens, and related records within a reasonable timeframe.',
      primary: { label: 'Email deletion request', href: `mailto:${supportEmail}?subject=Data%20deletion%20request` },
      secondary: { label: 'Privacy policy', href: '/privacy-policy', variant: 'secondary' }
    },
    article: [
      {
        heading: 'What can be deleted',
        body: [
          'Connected account metadata, OAuth state artifacts, stored token records, and service-side linkage records for the relevant account.',
          'Support records may be retained only when needed for legal, security, or abuse-prevention reasons.'
        ]
      },
      {
        heading: 'How to request deletion',
        body: [
          `Send an email to ${supportEmail} with the subject line "Data deletion request".`,
          'Include the platform name, account identifier, and enough detail to verify ownership of the connected account.'
        ]
      },
      {
        heading: 'Timeline',
        body: [
          'We aim to acknowledge requests promptly and complete deletion within a reasonable operational window after verification.',
          'If third-party platform data must be deleted separately, we will explain the practical limitations and next steps.'
        ]
      }
    ],
    footerNote: 'Delete requests should not be sent through public dashboards that might expose sensitive data.'
  },
  ru: {
    title: 'Удаление данных | SPG Utils',
    description: 'Как запросить удаление подключённых данных и связанных записей.',
    hero: {
      eyebrow: 'Data deletion',
      title: 'Понятный путь для удаления данных подключённого аккаунта.',
      lead:
        'Если пользователь хочет удалить данные, должен быть один очевидный путь, который покрывает account metadata, токены и связанные записи в разумные сроки.',
      primary: { label: 'Написать на удаление', href: `mailto:${supportEmail}?subject=Data%20deletion%20request` },
      secondary: { label: 'Политика конфиденциальности', href: '/ru/privacy-policy', variant: 'secondary' }
    },
    article: [
      {
        heading: 'Что можно удалить',
        body: [
          'Метаданные подключённого аккаунта, артефакты OAuth state, записи токенов и server-side linkage records для нужного аккаунта.',
          'Записи поддержки могут сохраняться только если это нужно по закону, для безопасности или anti-abuse.'
        ]
      },
      {
        heading: 'Как запросить удаление',
        body: [
          `Отправьте письмо на ${supportEmail} с темой "Data deletion request".`,
          'Укажите платформу, идентификатор аккаунта и достаточно данных, чтобы подтвердить владение подключённым аккаунтом.'
        ]
      },
      {
        heading: 'Сроки',
        body: [
          'Мы стараемся подтверждать запросы быстро и удалять данные в разумный операционный срок после верификации.',
          'Если данные сторонней платформы нужно удалять отдельно, мы объясним ограничения и дальнейшие шаги.'
        ]
      }
    ],
    footerNote: 'Запросы на удаление не стоит отправлять через публичные dashboard, где может быть чувствительная информация.'
  }
};

const reviewTikTok: PageBundle = {
  en: {
    title: 'TikTok Review | SPG Utils',
    description: 'Review-ready TikTok landing page with Telegram-first linking, OAuth flow, and safe status state.',
    hero: {
      eyebrow: 'TikTok review',
      title: 'Show the exact use case, login entry point, callback, and connected dashboard.',
      lead:
        'The review surface is structured to show a real app flow: a public landing page, OAuth entry, callback processing, and a dashboard that reveals only safe status information.',
      primary: { label: 'Login', href: '/review' },
      secondary: { label: 'Dashboard', href: '/review?tiktok=success', variant: 'secondary' },
      note: 'No token is rendered in the browser.'
    },
    review: {
      problem:
        'A connected product page needs a compliant OAuth flow, review-friendly explanation, and safe post-auth visibility.',
      permissions: [
        'Read account identity and basic profile data',
        'Publish capabilities only if approved by the product scope',
        'Store token metadata server-side'
      ],
      flow: ['Landing page', 'Login redirect', 'Callback verification', 'Token exchange', 'Dashboard state'],
      capabilities: ['Connected account status', 'Queue demo state', 'Capability explanation', 'Legal links'],
      notes: ['Tokens never appear in client UI', 'State is validated server-side', 'The dashboard only shows non-sensitive information']
    }
  },
  ru: {
    title: 'TikTok Review | SPG Utils',
    description: 'Review-ready TikTok landing page with Telegram-first linking, OAuth flow, and safe status state.',
    hero: {
      eyebrow: 'TikTok review',
      title: 'Показать use case, login entry point, callback и connected dashboard.',
      lead:
        'Review-surface построена как реальный app flow: публичная landing page, OAuth entry, обработка callback и dashboard, где показывается только безопасный статус.',
      primary: { label: 'Login', href: '/ru/review' },
      secondary: { label: 'Dashboard', href: '/ru/review?tiktok=success', variant: 'secondary' },
      note: 'Токены никогда не выводятся в браузер.'
    },
    review: {
      problem:
        'Подключённой странице продукта нужен корректный OAuth flow, review-friendly объяснение и безопасная post-auth видимость.',
      permissions: [
        'Чтение identity и базового профиля',
        'Publish capability только если она реально разрешена scope',
        'Хранение token metadata только на сервере'
      ],
      flow: ['Landing page', 'Login redirect', 'Проверка callback', 'Token exchange', 'Dashboard state'],
      capabilities: ['Статус подключённого аккаунта', 'Queue demo state', 'Объяснение возможностей', 'Ссылки на legal'],
      notes: ['Токены не появляются в UI', 'State валидируется на сервере', 'Dashboard показывает только безопасную информацию']
    }
  }
};

const reviewTikTokLogin: PageBundle = {
  en: {
    title: 'TikTok Login | SPG Utils',
    description: 'OAuth entry point for TikTok review and account connection.',
    hero: {
      eyebrow: 'TikTok login',
      title: 'Start OAuth without exposing any secret material in the browser.',
      lead:
        'This page exists to make the login entry point obvious and review-friendly while the Worker handles the actual OAuth handshake.',
      primary: { label: 'Continue to TikTok OAuth', href: apiUrl('/api/oauth/tiktok/start') },
      secondary: { label: 'Back to review page', href: '/review', variant: 'secondary' }
    }
  },
  ru: {
    title: 'TikTok Login | SPG Utils',
    description: 'OAuth entry point for TikTok review and account connection.',
    hero: {
      eyebrow: 'TikTok login',
      title: 'Запуск OAuth без раскрытия секретов в браузере.',
      lead:
        'Страница делает login entry point очевидным и удобным для review, а сам OAuth handshake выполняет Worker.',
      primary: { label: 'Перейти в TikTok OAuth', href: apiUrl('/api/oauth/tiktok/start') },
      secondary: { label: 'Назад к review', href: '/ru/review', variant: 'secondary' }
    }
  }
};

const reviewTikTokCallback: PageBundle = {
  en: {
    title: 'TikTok Callback | SPG Utils',
    description: 'Callback state page for TikTok authorization completion.',
    hero: {
      eyebrow: 'TikTok callback',
      title: 'Callback state is handled server-side before the dashboard opens.',
      lead:
        'When the provider redirects back, the Worker validates state, exchanges the code, stores token metadata, and then redirects to the dashboard state.',
      primary: { label: 'Return to review page', href: '/review', variant: 'secondary' },
      secondary: { label: 'Dashboard', href: '/review?tiktok=success' }
    }
  },
  ru: {
    title: 'TikTok Callback | SPG Utils',
    description: 'Callback state page for TikTok authorization completion.',
    hero: {
      eyebrow: 'TikTok callback',
      title: 'Callback state обрабатывается на сервере до открытия dashboard.',
      lead:
        'После редиректа провайдера Worker проверяет state, обменивает code, сохраняет metadata токена и только потом ведёт к dashboard.',
      primary: { label: 'Вернуться к review', href: '/ru/review', variant: 'secondary' },
      secondary: { label: 'Dashboard', href: '/ru/review?tiktok=success' }
    }
  }
};

const reviewTikTokDashboard: PageBundle = {
  en: {
    title: 'TikTok Dashboard | SPG Utils',
    description: 'Connected TikTok review dashboard with account and capability summary.',
    hero: {
      eyebrow: 'TikTok dashboard',
      title: 'Connected-account state, capability summary, and queue demo visibility.',
      lead:
        'The dashboard shows safe metadata only: connection status, scopes, expiry, and operational notes. No raw token data is exposed.',
      primary: { label: 'Start login', href: '/review' },
      secondary: { label: 'Data deletion', href: '/data-deletion', variant: 'secondary' }
    },
    status: [
      { label: 'Account', value: 'Connected example', tone: 'ok' },
      { label: 'Token status', value: 'Stored server-side', tone: 'ok' },
      { label: 'Queue', value: 'Demo ready', tone: 'neutral' },
      { label: 'Review links', value: 'Public and safe', tone: 'ok' }
    ],
    checklist: [
      { title: 'Visible on the dashboard', items: ['Account name or ID', 'Scope summary', 'Expiry status', 'Queue state', 'Legal links'] }
    ]
  },
  ru: {
    title: 'TikTok Dashboard | SPG Utils',
    description: 'Connected TikTok review dashboard with account and capability summary.',
    hero: {
      eyebrow: 'TikTok dashboard',
      title: 'Статус подключённого аккаунта, capabilities и demo-очередь.',
      lead:
        'Dashboard показывает только безопасные метаданные: статус подключения, scopes, expiry и операционные заметки. Сырые токены не отображаются.',
      primary: { label: 'Начать login', href: '/ru/review' },
      secondary: { label: 'Удаление данных', href: '/ru/data-deletion', variant: 'secondary' }
    },
    status: [
      { label: 'Account', value: 'Connected example', tone: 'ok' },
      { label: 'Token status', value: 'Хранится на сервере', tone: 'ok' },
      { label: 'Queue', value: 'Demo ready', tone: 'neutral' },
      { label: 'Review links', value: 'Public and safe', tone: 'ok' }
    ],
    checklist: [
      { title: 'Что видно на dashboard', items: ['Имя или ID аккаунта', 'Scope summary', 'Статус expiry', 'Состояние очереди', 'Ссылки на legal'] }
    ]
  }
};

const reviewMeta: PageBundle = {
  en: {
    title: 'Meta Review | SPG Utils',
    description: 'Review-ready Meta landing page with Telegram-first linking, OAuth flow, and permissions explanation.',
    hero: {
      eyebrow: 'Meta review',
      title: 'Explain the use case, permissions, and connected dashboard clearly.',
      lead:
        'This review path is intentionally direct: a public landing page, a login entry point, a callback handler, and a dashboard that clarifies safe account state.',
      primary: { label: 'Login', href: '/review' },
      secondary: { label: 'Dashboard', href: '/review?meta=success', variant: 'secondary' },
      note: 'Permissions are explained without claiming unsupported capabilities.'
    },
    review: {
      problem:
        'A product connecting to Meta must describe the use case, requested permissions, and post-auth handling in a review-friendly way.',
      permissions: [
        'Access account/page metadata where approved',
        'Publish content only where the app is authorized',
        'Store token metadata server-side only'
      ],
      flow: ['Landing page', 'Login redirect', 'Callback verification', 'Code exchange', 'Dashboard state'],
      capabilities: ['Connected account summary', 'Permissions explanation', 'Legal links', 'Request access readiness'],
      notes: [
        'No tokens are displayed in the browser',
        'State validation prevents CSRF replay',
        'Meta-specific long-lived exchange can be configured in the Worker'
      ]
    }
  },
  ru: {
    title: 'Meta Review | SPG Utils',
    description: 'Review-ready Meta landing page with Telegram-first linking, OAuth flow, and permissions explanation.',
    hero: {
      eyebrow: 'Meta review',
      title: 'Чётко объяснить use case, permissions и connected dashboard.',
      lead:
        'Review path намеренно прямой: публичная landing page, login entry point, callback handler и dashboard, который показывает безопасный статус аккаунта.',
      primary: { label: 'Login', href: '/ru/review' },
      secondary: { label: 'Dashboard', href: '/ru/review?meta=success', variant: 'secondary' },
      note: 'Permissions объясняются без обещаний неподдерживаемых функций.'
    },
    review: {
      problem:
        'Продукт, подключающийся к Meta, должен описать use case, permissions и post-auth обработку в review-friendly форме.',
      permissions: [
        'Доступ к metadata аккаунта/страницы там, где это одобрено',
        'Публикация контента только если приложение авторизовано',
        'Хранение token metadata только на сервере'
      ],
      flow: ['Landing page', 'Login redirect', 'Проверка callback', 'Code exchange', 'Dashboard state'],
      capabilities: ['Сводка по подключённому аккаунту', 'Объяснение permissions', 'Ссылки на legal', 'Готовность к request access'],
      notes: [
        'Токены не показываются в браузере',
        'Проверка state защищает от replay',
        'Meta long-lived exchange можно настроить в Worker'
      ]
    }
  }
};

const reviewMetaLogin: PageBundle = {
  en: {
    title: 'Meta Login | SPG Utils',
    description: 'OAuth entry point for Meta review and account connection.',
    hero: {
      eyebrow: 'Meta login',
      title: 'Start the OAuth flow without surfacing secrets in the browser.',
      lead:
        'The login page is intentionally simple: it points to the Worker endpoint that starts the OAuth authorization flow.',
      primary: { label: 'Continue to Meta OAuth', href: apiUrl('/api/oauth/meta/start') },
      secondary: { label: 'Back to review page', href: '/review', variant: 'secondary' }
    }
  },
  ru: {
    title: 'Meta Login | SPG Utils',
    description: 'OAuth entry point for Meta review and account connection.',
    hero: {
      eyebrow: 'Meta login',
      title: 'Запустить OAuth без раскрытия секретов в браузере.',
      lead:
        'Login page специально простая: она ведёт в Worker endpoint, который запускает OAuth authorization flow.',
      primary: { label: 'Перейти в Meta OAuth', href: apiUrl('/api/oauth/meta/start') },
      secondary: { label: 'Назад к review', href: '/ru/review', variant: 'secondary' }
    }
  }
};

const reviewMetaCallback: PageBundle = {
  en: {
    title: 'Meta Callback | SPG Utils',
    description: 'Callback state page for Meta authorization completion.',
    hero: {
      eyebrow: 'Meta callback',
      title: 'Callback verification, token exchange, and long-lived upgrade happen server-side.',
      lead:
        'The callback page is a clean confirmation surface. The Worker validates state, exchanges the code, and performs the configured token handling before redirecting to the dashboard.',
      primary: { label: 'Return to review page', href: '/review', variant: 'secondary' },
      secondary: { label: 'Dashboard', href: '/review?meta=success' }
    }
  },
  ru: {
    title: 'Meta Callback | SPG Utils',
    description: 'Callback state page for Meta authorization completion.',
    hero: {
      eyebrow: 'Meta callback',
      title: 'Проверка callback, token exchange и long-lived upgrade происходят на сервере.',
      lead:
        'Callback page — это аккуратная поверхность подтверждения. Worker проверяет state, обменивает code и выполняет настроенную обработку токена перед переходом к dashboard.',
      primary: { label: 'Вернуться к review', href: '/ru/review', variant: 'secondary' },
      secondary: { label: 'Dashboard', href: '/ru/review?meta=success' }
    }
  }
};

const reviewMetaDashboard: PageBundle = {
  en: {
    title: 'Meta Dashboard | SPG Utils',
    description: 'Connected Meta review dashboard with account and capability summary.',
    hero: {
      eyebrow: 'Meta dashboard',
      title: 'Connected state, permissions summary, and safe operational data.',
      lead:
        'The dashboard makes it clear that connected account information exists, while keeping all sensitive tokens and secrets out of the browser UI.',
      primary: { label: 'Start login', href: '/review' },
      secondary: { label: 'Data deletion', href: '/data-deletion', variant: 'secondary' }
    },
    status: [
      { label: 'Account', value: 'Connected example', tone: 'ok' },
      { label: 'Token status', value: 'Server-side only', tone: 'ok' },
      { label: 'Permissions', value: 'Explained safely', tone: 'neutral' },
      { label: 'Review state', value: 'Ready', tone: 'ok' }
    ],
    checklist: [
      { title: 'Visible on the dashboard', items: ['Connected account', 'Permissions summary', 'Expiry status', 'Legal links', 'Deletion path'] }
    ]
  },
  ru: {
    title: 'Meta Dashboard | SPG Utils',
    description: 'Connected Meta review dashboard with account and capability summary.',
    hero: {
      eyebrow: 'Meta dashboard',
      title: 'Connected state, permissions summary и безопасные операционные данные.',
      lead:
        'Dashboard показывает, что данные подключённого аккаунта есть, но все чувствительные токены и секреты остаются вне browser UI.',
      primary: { label: 'Начать login', href: '/ru/review' },
      secondary: { label: 'Удаление данных', href: '/ru/data-deletion', variant: 'secondary' }
    },
    status: [
      { label: 'Account', value: 'Connected example', tone: 'ok' },
      { label: 'Token status', value: 'Только на сервере', tone: 'ok' },
      { label: 'Permissions', value: 'Безопасно объяснены', tone: 'neutral' },
      { label: 'Review state', value: 'Ready', tone: 'ok' }
    ],
    checklist: [
      { title: 'Что видно на dashboard', items: ['Connected account', 'Permissions summary', 'Expiry status', 'Ссылки на legal', 'Путь удаления'] }
    ]
  }
};

const bundles: Record<PageKey, PageBundle> = {
  home,
  products,
  'vpn-bot': vpnBot,
  autoposter,
  about,
  contact,
  faq,
  status,
  'coming-soon': comingSoon,
  'privacy-policy': privacy,
  'terms-of-service': terms,
  'data-deletion': deletion,
  'review-tiktok': reviewTikTok,
  'review-tiktok-login': reviewTikTokLogin,
  'review-tiktok-callback': reviewTikTokCallback,
  'review-tiktok-dashboard': reviewTikTokDashboard,
  'review-meta': reviewMeta,
  'review-meta-login': reviewMetaLogin,
  'review-meta-callback': reviewMetaCallback,
  'review-meta-dashboard': reviewMetaDashboard
};

export const getPageContent = (key: PageKey, locale: Locale): PageContent => bundles[key][locale];

export const getRouteMeta = (key: PageKey, locale: Locale) => {
  const content = getPageContent(key, locale);
  return {
    title: content.title,
    description: content.description,
    canonical: `${siteUrl}${canonicalUrl(locale, key)}`,
    path: routePaths[locale][key],
    noindex: content.noindex ?? false
  };
};

export const allPageKeys = Object.keys(bundles) as PageKey[];

