export default defineNuxtPlugin({
  setup(nuxtApp) {
    const { clear } = useUserSession()
    const toast = useToast()
    const api = $fetch.create({
      // baseURL: 'https://api.nuxt.com',
      onRequest({ options }) {
        const header = import.meta.server && nuxtApp.ssrContext?.event
          ? nuxtApp.ssrContext?.event.headers.get('Cookie')
          : useRequestHeader('Cookie')
        if (header) {
          options.headers.set('Cookie', header)
        }
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          await clear()
          await navigateTo('/login')
          return
        }

        if (response.status === 403) {
          toast.add({
            title: 'Error',
            description: (response._data)?.message || 'Authorization',
            color: 'error',
          })
        }
      },
    })

    return {
      provide: {
        api,
      },
    }
  },
})
