<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import { useLocalStorage } from '@vueuse/core'

const $emits = defineEmits<{
  close: []
}>()
const searchTerm = ref('')

const hideSearchTips = useLocalStorage('search-dialog:hide-search-tips', false)
const { user } = useUserSession()
const { searchKbds } = useSearch()

// this function should add the item to the array at the specified index, if there are any items ther - push the other items in front of the specified index
const pushToArrayIndex = <T = unknown>(array: T[], index: number, value: T) => {
  if (index === 0) {
    array.unshift(value)
  } else if (index === array.length) {
    array.push(value)
  } else {
    array.splice(index, 0, value)
  }
}

const groups = computed<CommandPaletteGroup[]>(() => {
  const items: CommandPaletteGroup[] = [
    {
      id: 'domains',
      label: searchTerm.value ? `Domains matching “${searchTerm.value}”...` : 'Domains',
      items: [],
    },
  ]

  const actions: CommandPaletteItem[] = []

  //
  //
  //   // check if we have this domain, if we dont, add the "add" action:
  //   if (!domains.value?.find(d => d.name === searchTerm.value)) {
  //     actions.push({
  //       icon: 'i-lucide-plus',
  //       label: `Add "${searchTerm.value}"`,
  //       value: 'create',
  //       onSelect: async () => {
  //         const created = await domainCreateOverlay.open({
  //           initialState: { name: searchTerm.value },
  //         })
  //         if (!created) return
  //
  //         if (typeof created !== 'boolean') {
  //           refreshDashboard()
  //           await domainViewOverlay.open({
  //             domainId: created.id,
  //           })
  //         }
  //
  //         $emits('close')
  //       },
  //     })
  //   }

  actions.push({
    icon: 'i-lucide-search',
    label: searchTerm.value ? `Perform whois lookup for "${searchTerm.value}"` : 'Perform whois lookup',
    value: 'lookup',
    onSelect: async () => {
      try {
        useToast().add({
          title: 'Click!',
          description: 'Clicked LOOKUP!',
        })
      } catch (err: unknown) {
        useToast().add(errorToToast(err))
      }
    },
  })

  if (actions && actions.length > 0) {
    pushToArrayIndex(items, 1, {
      id: 'actions',
      label: searchTerm.value ? `Actions for "${searchTerm.value}"` : 'Actions',
      ignoreFilter: true,
      items: actions,
    })
    // items.unshift({
    //   id: 'actions',
    //   ignoreFilter: true,
    //   items: actions,
    // })
  }

  const navigationItems: CommandPaletteItem[] = [
    {
      icon: 'i-lucide-layout-dashboard',
      label: 'Dashboard',
      value: 'dashboard',
      to: '/app',
      onSelect: () => $emits('close'),
    },
    {
      icon: 'i-lucide-globe',
      label: 'Domains',
      value: 'domains',
      to: '/app/domains',
      onSelect: () => $emits('close'),
    },
  ]

  if (userHasRole(user.value, 'admin')) {
    navigationItems.push(
      {
        icon: 'i-lucide-shield',
        label: 'Admin',
        value: 'admin',
        to: '/admin',
        onSelect: () => $emits('close'),
      },
    )
  }

  // add navigation
  items.push({
    id: 'navigation',
    label: 'Navigation',
    ignoreFilter: true,
    items: navigationItems,
  })

  //
  return items
})

function onOpen() {
  // TODO: Fetch stuff for init if not ready?
}
</script>

<template>
  <UModal
    @update:open="onOpen"
  >
    <UButton
      label="Search..."
      color="neutral"
      variant="subtle"
      icon="i-lucide-search"
    />

    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :loading="false"
        :groups="groups"
        placeholder="Search..."
        class="h-80"
        selection-behavior="toggle"
        :selected-icon="false"
        :ui="{
          footer: 'hidden md:block p-0',
        }"
      >
        <template #item-trailing="{ item }">
          <UBadge
            v-if="item.group === 'domains'"
            :label="item.registrar?.name || 'N/A'"
            color="primary"
            variant="subtle"
            size="sm"
          />
        </template>
        <template
          v-if="!hideSearchTips"
          #footer
        >
          <div class="items-center justify-between gap-2 flex">
            <UButton
              color="neutral"
              variant="link"
              label="Hide"
              title="Hide search tips"
              class="text-dimmed"
              icon="i-lucide-eye-off"
              size="xs"
              @click="hideSearchTips = true"
            />
            <div class="flex items-center gap-1">
              <UButton
                color="neutral"
                variant="ghost"
                label="Search"
                class="text-dimmed"
                size="xs"
              >
                <template #trailing>
                  <UKbd
                    v-for="kbd in searchKbds"
                    :key="kbd"
                    size="sm"
                    :value="kbd"
                  />
                </template>
              </UButton>
              <USeparator
                orientation="vertical"
                class="h-4"
              />
              <UButton
                color="neutral"
                variant="ghost"
                label="Navigate"
                class="text-dimmed"
                size="xs"
              >
                <template #trailing>
                  <UKbd size="sm">
                    <UIcon name="i-lucide-chevron-up" />
                  </UKbd>
                  <UKbd size="sm">
                    <UIcon name="i-lucide-chevron-down" />
                  </UKbd>
                </template>
              </UButton>
              <USeparator
                orientation="vertical"
                class="h-4"
              />
              <UButton
                color="neutral"
                variant="ghost"
                label="Select"
                class="text-dimmed"
                size="xs"
              >
                <template #trailing>
                  <UKbd
                    size="sm"
                    value="enter"
                  />
                </template>
              </UButton>
              <USeparator
                orientation="vertical"
                class="h-4"
              />
              <UButton
                color="neutral"
                variant="ghost"
                label="Close"
                class="text-dimmed"
                size="xs"
              >
                <template #trailing>
                  <UKbd
                    value="esc"
                    size="sm"
                  />
                </template>
              </UButton>
            </div>
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>
