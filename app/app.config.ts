export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate',
    },
  } as never,
  autoForm: {
    components: {
      url: () => ({ component: 'UrlInput' }),
      date: () => ({ component: 'DateInput' }),
      object: () => ({ component: 'textarea' }),
      array: () => ({ component: 'TagInput' }),
    },
  },
  search: {
    kbds: ['/'],
  },
  footer: {
    icon: 'i-simple-icons-nuxtdotjs',
  },
  auth: {
    passkey: true,
    development: true,
    custom: true,
  },
})
