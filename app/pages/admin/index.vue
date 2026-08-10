<script setup lang="ts">
import type { PageCardProps } from '@nuxt/ui'

const quickActions = computed<PageCardProps[]>(() => {
  return [
    {
      title: 'Users',
      description: 'Manage users and their permissions.',
      to: '/admin/users',
      icon: 'i-lucide-users',
    },
    {
      title: 'Settings',
      description: 'Configure application settings.',
      to: '/admin/settings',
      icon: 'i-lucide-settings',
    },
  ]
})
</script>

<template>
  <UContainer>
    <AppPageHeader title="Admin" />
    <UPageBody>
      <UPageGrid>
        <UPageCard
          v-for="action in quickActions"
          :key="action.title"
          v-bind="action"
        />
      </UPageGrid>
    </UPageBody>
  </UContainer>
</template>
