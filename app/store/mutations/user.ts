import { USER_KEYS } from '~/store/queryKeys.ts'

export const useUpdateUserProfile = defineMutation(() => {
  const { $api } = useNuxtApp()
  const queryCache = useQueryCache()

  //
  const { mutateAsync, ...mutation } = useMutation({
    async mutation(profile) {
      return $api('/api/account', {
        method: 'PATCH',
        body: profile,
      })
    },
    onSuccess() {
      return queryCache.invalidateQueries({ key: USER_KEYS.root })
    },
  })

  return {
    ...mutation,
    updateProfile: mutateAsync,
  }
})

export const useDeleteUserPasskey = defineMutation(() => {
  const { $api } = useNuxtApp()
  const queryCache = useQueryCache()

  const { mutateAsync, ...mutation } = useMutation({
    async mutation(id: string) {
      return $api(`/api/profile/passkeys/${id}`, {
        method: 'DELETE',
      })
    },
    async onSuccess(_, id) {
      // Ensures we cancel this.
      queryCache.cancelQueries({ key: USER_KEYS.passkeyDetail(id) }, 'deletePasskey')

      // ...
      return queryCache.invalidateQueries({ key: USER_KEYS.passkeys })
    },
  })

  //
  return {
    ...mutation,
    deletePasskey: mutateAsync,
  }
})
