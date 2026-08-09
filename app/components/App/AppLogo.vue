<script setup lang="ts">
import { name } from '~/../package.json' with { type: 'json' }
</script>

<template>
  <span>{{ name }}</span>
</template>
