<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo />
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
        <UButton
          v-if="!loggedIn"
          to="/login"
          icon="i-lucide-log-in"
          external
        >
          Sign In
        </UButton>
        <AccountMenu v-else />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <AppFooter />
  </div>
</template>
