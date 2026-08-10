<script setup lang="ts">
import type { ButtonProps, NavigationMenuItem, KbdProps } from '@nuxt/ui'
import { AppSearchButton } from '#components'
import { useFooter } from '~/composables/useFooter.ts'

const { user } = useUserSession()
const createMenuOpen = ref(false)
const { icon: footerIcon } = useFooter()

type ActionWithKbd = (ButtonProps & { kbds?: KbdProps['value'][] })
const headerActions = computed<ActionWithKbd[]>(() => [
  // ..TBA
])

const globalShortcuts = computed<ActionWithKbd[]>(() => [
  // ..TBA
])

defineShortcuts({
  ...extractShortcuts(headerActions.value),
  ...extractShortcuts(globalShortcuts.value),
})

const navigationItems = computed<NavigationMenuItem[][]>(() => {
  const items: NavigationMenuItem[][] = [
    [
      { label: 'Dashboard', to: '/app', icon: 'i-lucide-layout-dashboard' },
    ],
  ]

  if (userHasRole(user.value, 'admin')) {
    items.push([
      { label: 'Admin', to: '/admin', icon: 'i-lucide-shield' },
    ])
  }

  return items
})
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/app">
          <AppLogo />
        </NuxtLink>
      </template>
      <UNavigationMenu
        :items="navigationItems"
        variant="link"
      />
      <template #body>
        <UNavigationMenu
          :items="navigationItems"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
      <template #right>
        <AppSearchButton />
        <UButton
          v-for="action in headerActions"
          :key="action.label"
          v-bind="action"
          variant="ghost"
          color="neutral"
        />

        <UDropdownMenu
          v-model:open="createMenuOpen"
          :items="globalShortcuts as never[]"
        >
          <UButton
            icon="i-lucide-plus"
            variant="ghost"
            color="neutral"
          />
        </UDropdownMenu>
        <USeparator
          orientation="vertical"
          class="h-6"
        />
        <UColorModeButton />
        <AccountMenu />
      </template>
    </UHeader>
    <UMain>
      <slot />
    </UMain>

    <USeparator :icon="footerIcon" />

    <AppFooter />
  </div>
</template>
