<script setup lang="ts">
</script>

<template>
  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        Hareland • © {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <UButton
        :to="`https://hareland.eu?ref=${useRequestURL().host}`"
        target="_blank"
        icon="i-lucide-globe"
        aria-label="Website"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
