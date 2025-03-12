// // https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   modules: ['@nuxtjs/tailwindcss'],
//   compatibilityDate: '2024-11-01',
//   devtools: { enabled: true },
//   css: ['~/assets/css/main.css'],
//   ssr: false,
//   devServer:{
//     port: 4000
//   },
//   app: {
//     baseURL: '/nutricup/',
//     cdnURL: 'https://patrikborzik.sk/nutricup/',
//     head: {
//       link: [
//         {
//           rel: 'stylesheet',
//           href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap',
//         },
//       ],
//     },
//   },
// })

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'], // Add the PWA module
  compatibilityDate: '2025-01-13',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  ssr: false,
  devServer: {
    port: 4000,
  },
  app: {
    baseURL: '/nutricup/',
    cdnURL: 'https://patrikborzik.sk/nutricup/',
    head: {
      meta:[
        {name: 'theme-color', content: '#111111'},
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap',
        },
        { rel: 'manifest', href: '/nutricup/manifest.webmanifest' },
      ],
    },
  },
  pwa: {
    registerType: 'autoUpdate', // Automatically updates the service worker
    manifest: {
      name: 'Nutricup PWA',
      short_name: 'Nutricup',
      description: 'A Progressive Web App for Nutricup',
      display: 'standalone',
      start_url: '/nutricup/', // Adjusted for your baseURL
      icons: [
        {
          src: '/nutricup/icon-192x192.png', // Adjusted for baseURL
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/nutricup/icon-512x512.png', // Adjusted for baseURL
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  },
});