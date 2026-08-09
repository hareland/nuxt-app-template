import { createResolver, addServerHandler, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'development-auth',
    configKey: 'developmentAuth',
  },
  async setup(_, nuxtApp) {
    if (!nuxtApp.options.dev) return
    const { resolve } = createResolver(import.meta.url)
    console.log('Added development auth module on /auth/development')
    addServerHandler({
      route: '/auth/development',
      handler: resolve('./runtime/server-handler.ts'),
    })
  },
})
