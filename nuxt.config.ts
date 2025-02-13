// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@scalar/nuxt'
  ],

  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  // if you want to use the Scalar API Documentation UI (Statique, your own API documentation) else comment the scalar object
  scalar: {
    theme: "deepSpace",
    darkMode: true,
    hideModels: false,
    hideDownloadButton: false,
    metaData: {
      title: 'API Documentation by Scalar',
    },
    proxyUrl: 'https://proxy.scalar.com',
    searchHotKey: 'k',
    showSidebar: true,
    pathRouting: {
      basePath: '/docs',
    },
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  compatibilityDate: '2025-02-11',
})