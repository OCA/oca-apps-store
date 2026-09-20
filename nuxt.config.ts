// https://nuxt.com/docs/api/configuration/nuxt-config
//
// OCA_PREVIEW=true -> preview build: a single page application (client side rendering)
// published on GitHub Pages, one sub-directory per pull request.
// See .github/workflows/pages-preview.yml.
// Without this variable the production behaviour (server side rendering) is unchanged.
const preview = process.env.OCA_PREVIEW === 'true'
// Base URL at build time (also used for the favicon, which is an absolute path)
const baseURL = (process.env.NUXT_APP_BASE_URL || '/').replace(/\/+$/, '')

export default defineNuxtConfig({
  modules: [
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxtjs/mdc',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/device',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    '@vueuse/motion',
    'nuxt-schema-org',
    'nuxt-site-config',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/scripts',
    'nuxt-seo-utils',
    'nuxt-vitalizer'
  ],
  vitalizer: {
    // Remove the render-blocking entry CSS
    disableStylesheets: "entry",
    disablePrefetchLinks: true,
    disablePreloadLinks: true,

  },
  features: {
    inlineStyles: true
  },
  image: {
    format: ['webp'],
    domains: ['odoo-community.org'],
    // A static build has no image optimization server: without this the /_ipx/... URLs
    // return a 404 in a preview.
    ...(preview ? { provider: 'none' } : {}),
  },
  plugins: ['~/plugins/services/index', '~/plugins/sponsorship'],
  ssr: !preview,
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    rootAttrs: {
      'data-vaul-drawer-wrapper': '',
      class: 'bg-default',
    },
    head: {
      meta: [
        { name: 'theme-color', content: '#151B47' },
        // a preview must never be indexed
        ...(preview ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: `${baseURL}/favicon.png` }],
    },
  },
  site: {
    url: 'https://apps.odoo-community.org',
    name: 'OCA Apps Store',
    title: 'Odoo Community Association Appstore',
    description:
      'OCA Appstore is the place to find and share Odoo apps, modules, and services developed by the Odoo Community Association (OCA).',
  },
  sitemap: {
    autoI18n: false,
    // In preview the module stays enabled (the server/api/__sitemap__/* routes import
    // `defineSitemapEventHandler` from `#imports`, disabling it breaks the prerender) but no
    // source is declared: those API routes do not exist in a static build.
    ...(preview
      ? { exclude: ['/**'] }
      : {
          sitemaps: {
            modules: {
              sources: ['/api/__sitemap__/modules'],
            },
            companies: {
              sources: ['/api/__sitemap__/companies'],
            },
            persons: {
              sources: ['/api/__sitemap__/persons'],
            },
            categories: {
              sources: ['/api/__sitemap__/categories'],
            },
          },
        }),
  },
  // The robots module refuses to generate a robots.txt when a base URL is set (the case of
  // a preview served under /oca-apps-store/...): the workflow writes its own.
  robots: preview ? { robotsTxt: false } : {},
  ui: {
    colorMode: true,
  },
  spaLoadingTemplate: 'assets/templates/loading.html',
  runtimeConfig: {
    // Serveur-side only configuration
    basicAuth: process.env.NUXT_BASIC_AUTH || '',
    // Client-side and server-side configuration
    public: {
      search: {
        url: process.env.NUXT_PUBLIC_SEARCH_URL || '',
        key: process.env.NUXT_PUBLIC_SEARCH_KEY || '',
        indices: {
          persons: {
            en: process.env.NUXT_PUBLIC_SEARCH_INDICES_PERSONS_EN || '',
          },
          companies: {
            en: process.env.NUXT_PUBLIC_SEARCH_INDICES_COMPANIES_EN || '',
          },
          modules: {
            en: process.env.NUXT_PUBLIC_SEARCH_INDICES_MODULES_EN || '',
          },
          categories: {
            en: process.env.NUXT_PUBLIC_SEARCH_INDICES_CATEGORIES_EN || '',
          },
        },
      },
      gtm: {
        id: process.env.NUXT_PUBLIC_GTM_ID,
      },
    },
  },

  alias: {
    '#models': '/models',
    '#services': '/services',
  },
  routeRules: {
    '/': {
      ssr: true,

    },
    '/community': {
      ssr: true,

    },
    '/community/**': {
      ssr: true,

    },
    '/modules/**': {

      ssr: true,
    },
    '/module': {
      redirect: '/modules',
    },
    'shop': {
      redirect: '/modules',
    },
    '/categories': {
      ssr: true,
    },
    '/categories/**': {
      ssr: true,
    },
    '/sponsors': {
      ssr: true,
    },
    '/integrators': {

      ssr: true,
    },
    '/integrators/**': {
      prerender: false,
      ssr: true,
    },
    '/**': {
      ssr: true,
    },
  },
  sourcemap: {
    server: false,
    client: false,
  },
  compatibilityDate: '2025-07-16',
  eslint: {
    config: {
      stylistic: false,
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        language: 'en_us',
        name: 'English',
        file: 'en-US.json',
        icon: 'i-circle-flags-lang-en',
      },
    ],
    langDir: 'locales/',
    strategy: 'prefix_and_default',
    detectBrowserLanguage: false,
  },
  pwa: {
    // A service worker caching the application has no point on a disposable preview, and it
    // makes tests lie (content served from the cache).
    disable: preview,
    strategies: 'injectManifest',
    srcDir: 'pwa',
    filename: 'sw.ts',
    registerType: 'prompt',
    manifest: {
      name: 'OCA Appstore',
      short_name: 'OCA Appstore',
      description: 'OCA Appstore PWA',
      theme_color: '#283687',
      start_url: '/',
      display: 'standalone',

      background_color: '#ffffff',
      icons: [
        {
          src: '/logo-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/logo-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      categories: ['shopping', 'utilities'],
      id: '/',
      display_override: ['window-controls-overlay', 'standalone'],
      launch_handler: {
        client_mode: 'navigate-existing',
      },
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
    },
  },
  $development: {

    nitro: {
      compressPublicAssets: true,
      storage: {
        cache: {
          driver: 'fs',
          base: '',
        },
      },
    },
  }
})