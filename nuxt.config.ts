// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@scalar/nuxt'],

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
    spec: {
      url: 'http://127.0.0.1:3000/api.docs.yaml',
    },
  },

  compatibilityDate: '2025-02-11',
})