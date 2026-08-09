// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxthub/core',
    '@nuxt/image',
    '@nuxt/test-utils',
    'nuxt-auth-utils',
    '@norbiros/nuxt-auto-form',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
  ],

  $development: {
    nitro: {
      scheduledTasks: {
        '* * * * *': ['test:command'],
      },
    },
  },

  $production: {
    nitro: {
      scheduledTasks: {
        '*/5 * * * *': ['test:command'],
      },
    },
  },

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      baseCurrency: 'EUR',
    },
  },

  routeRules: {
    '/app/**': { appLayout: 'app', appMiddleware: ['auth'] },
    '/admin/**': { appLayout: 'app', appMiddleware: ['auth', 'is-admin'] },
    '/profile': { appLayout: 'app', appMiddleware: ['auth'] },
    '/login': { appLayout: 'auth' },
  },

  compatibilityDate: '2026-06-30',
  nitro: {
    experimental: {
      tasks: true,
    },
  },

  hub: {
    db: {
      dialect: 'sqlite',
      casing: 'snake_case',
    },
    kv: true,
  },

  auth: {
    webAuthn: true,
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
      },
    },
  },
})
