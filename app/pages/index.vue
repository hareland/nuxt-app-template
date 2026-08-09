<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { loggedIn, user } = useUserSession()

const actions = computed<ButtonProps[]>(() => {
  if (loggedIn.value && user.value) {
    return [{
      label: 'Go to App',
      to: '/app',
      trailingIcon: 'i-lucide-arrow-right',
      color: 'neutral',
      variant: 'solid',
    }]
  }

  return [{
    label: 'Sign In',
    to: '/login',
    icon: 'i-lucide-log-in',
    color: 'primary',
    variant: 'solid',
  }]
})
</script>

<template>
  <UContainer>
    <UPageBody>
      <UEmpty
        title="Welcome"
        :actions="actions"
      />
    </UPageBody>
  </UContainer>
</template>
