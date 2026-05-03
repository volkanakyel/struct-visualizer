import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'motion-v/nuxt'],
  css: ['~/assets/css/tailwind.css'],
  typescript: {
    strict: true,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Struct Visualizer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#fafafa' },
        {
          name: 'description',
          content:
            'Turn PocketBase schemas and arbitrary JSON into a calm, interactive graph. Paste, explore, understand structure at a glance.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
    },
  },
  tailwindcss: {
    configPath: 'tailwind.config.js',
  },
})
