<script setup lang="ts">
withDefaults(defineProps<{
  collapsed?: boolean
}>(), {
  collapsed: false,
})

const { openSearchModal, searchKbds } = useSearch()

const Button = computed(() => ({
  ariaLabel: 'Search',
  icon: 'i-lucide-search',
  onClick: () => {
    openSearchModal()
  },
  kbds: searchKbds.value,
  slot: 'search',
}))

defineShortcuts(extractShortcuts([Button.value]))
</script>

<template>
  <UButton
    color="neutral"
    v-bind="Button"
    :variant="collapsed ? 'ghost' : 'outline'"
    icon="i-lucide-search"
    :label="collapsed ? undefined : 'Search...'"
    :class="collapsed ? '' : ''"
    :ui="{
      label: 'text-muted font-normal flex-1 text-left',
    }"
  >
    <template
      v-if="!collapsed"
      #trailing
    >
      <UKbd
        v-for="kbd in Button.kbds"
        :key="kbd"
        :value="kbd"
        class="ms-auto"
      />
    </template>
  </ubutton>
</template>
