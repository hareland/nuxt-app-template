import { USER_KEYS } from '~/store/queryKeys.ts'

export const useUserProfileQueryOptions = defineQueryOptions(() => {
  const { $api } = useNuxtApp()
  return {
    query: () => $api('/api/profile'),
    key: USER_KEYS.account,
  }
})

export const useUserDashboardQueryOptions = defineQueryOptions(() => {
  const { $api } = useNuxtApp()
  return {
    query: () => $api('/api/dashboard'),
    key: USER_KEYS.dashboard,
  }
})

export const useUserPasskeysQueryOptions = defineQueryOptions(() => {
  const { $api } = useNuxtApp()
  return {
    query: () => $api('/api/profile/passkeys'),
    key: USER_KEYS.passkeys,
  }
})

export const useUserPasskeyQueryOptions = defineQueryOptions((id: string) => {
  const { $api } = useNuxtApp()
  return {
    query: () => $api(`/api/profile/passkeys/${id}`),
    key: () => USER_KEYS.passkeyDetail(id),
  }
})
