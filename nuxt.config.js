const pkg = require('./package')

module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [{
        charset: 'utf-8'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/main.css'
  ],

  /*
   ** Plugins to load before mounting the App
   */
   plugins: [ {src: '~plugins/product-zoomer', ssr: false}, {src:'~/plugins/vue-notification', ssr: false} ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios'

    // Doc: https://github.com/nuxt-community/axios-module#usage

  ],

  axios: {
    baseURL: process.env.BASE_URL
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  }
}
