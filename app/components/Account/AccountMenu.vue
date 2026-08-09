<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { computedAsync } from '@vueuse/core'
import { upperFirst } from 'scule'

const { user, clear } = useUserSession()

const onSignOut = async () => {
  await clear()
  await navigateTo('/')
}

const getFirstLetter = (name: string | number) => {
  return String(typeof name === 'string' ? name.charAt(0)?.toUpperCase() : name)
}

const items = computedAsync<DropdownMenuItem[][]>(async (): Promise<DropdownMenuItem[][]> => {
  const items: DropdownMenuItem[][] = []
  // Push the top part...
  if (user.value) {
    items.push([
      {
        type: 'label',
        label: `${user.value.email || user.value.name || user.value.id}`,
        avatar: {
          text: getFirstLetter(user.value.email || user.value.name || user.value.id),
        },
        slot: 'label' as const,
      },
    ])
  }

  items.push([
    {
      label: 'Dashboard',
      to: '/app',
      icon: 'i-lucide-layout-dashboard',
    },
    {
      label: 'Profile',
      to: '/profile',
      icon: 'i-lucide-user',
    },
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      to: '#',
      onClick: onSignOut,
    },
  ])

  return items
})
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'start' }"
    :ui="{ content: 'w-48' }"
  >
    <template #default>
      <UButton
        aria-label="Account Menu"
        color="neutral"
        variant="ghost"
        icon="i-lucide-user"
      />
    </template>
    <template #label="bindItem">
      <UUser
        v-bind="bindItem.item as { avatar?: never }"
      >
        <template #name>
          <UBadge
            v-if="user && !userHasRole(user, 'user')"
            size="xs"
            variant="subtle"
          >
            {{ upperFirst(user.role) }}
          </UBadge>
          <div>{{ (bindItem.item as { label?: string })?.label }}</div>
        </template>
      </UUser>
    </template>
  </UDropdownMenu>
</template>
