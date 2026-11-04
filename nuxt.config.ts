import { SECURITY_HEADERS } from './server/utils/statusSecurity'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=2' }
      ]
    }
  },

  routeRules: {
    '/**': {
      headers: { ...SECURITY_HEADERS }
    }
  },

  devServer: {
    host: '127.0.0.1',
    port: 27800
  }
})
