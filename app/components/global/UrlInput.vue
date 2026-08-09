<script setup lang="ts">
const modelValue = defineModel<string>()

const errors = ref<string[]>([])

const model = computed({
  get: () => modelValue.value,
  set: (value) => {
    modelValue.value = value
    errors.value = []
    if (!value) return
    if (!value.startsWith('http://') && !value.startsWith('https://'))
      errors.value.push(
        'URL must start with http:// or https://',
      )
  },
})
</script>

<template>
  <UInput
    v-model="model"
    type="url"
    :errors="errors"
  />
</template>
