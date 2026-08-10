<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import { LazyAuthPasskeyAuthModal } from '#components'

const { isSupported } = useWebAuthn()

const isDevelopment = computed(() => import.meta.dev || false)
const overlay = useOverlay()
const passkeyModal = overlay.create(LazyAuthPasskeyAuthModal)

const providers = computed<ButtonProps[]>(() => {
  const items: ButtonProps[] = [
    // {
    //   label: 'Google',
    //   to: '/auth/google',
    //   icon: 'i-simple-icons-google',
    //   variant: 'outline',
    // },
  ]

  if (isSupported.value) {
    const { passkey } = useAppConfig().auth
    if (passkey) {
      items.push({
        label: 'Passkey',
        icon: 'i-lucide-fingerprint',
        variant: 'outline',
        onClick: async () => {
          const authenticated = await passkeyModal.open()
          return navigateTo(authenticated ? '/app' : '/login')
        },
      })
    }
  }

  if (isDevelopment.value) {
    const { development, custom } = useAppConfig().auth
    if (development) {
      items.push({
        label: 'Development User',
        to: '/auth/development',
        icon: 'i-lucide-terminal-square',
        variant: 'outline',
        external: true,
      })
    }
    if (custom) {
      items.push({
        label: 'Custom User',
        icon: 'i-lucide-terminal-square',
        variant: 'outline',
        external: true,
      })
    }
  }

  return items
})
</script>

<template>
  <UContainer>
    <UPageBody class="flex flex-col items-center justify-center gap-4 p-4">
      <UPageCard
        v-if="providers && providers.length > 0"
        class="w-full max-w-md"
      >
        <UAuthForm
          title="Login"
          description="Login to your account by selecting a provider below."
          :providers="providers"
        />
      </UPageCard>
      <UEmpty
        v-else
        title="No Login Providers Found"
        description="Please contact the administrator to set up login providers."
      />
    </UPageBody>
  </UContainer>
</template>
