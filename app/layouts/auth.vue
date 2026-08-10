<script setup lang="ts">
import { useFooter } from '~/composables/useFooter.ts'

const { icon } = useFooter()
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
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <USeparator :icon="icon" />
    <AppFooter />
  </div>
</template>
