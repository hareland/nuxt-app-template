<script setup lang="ts">
import { z } from 'zod/v4'

const $emits = defineEmits<{
  close: [boolean | undefined]
}>()

const { isSupported, authenticate } = useWebAuthn()
const { fetch: fetchSession } = useUserSession()

const isLoading = ref(false)
const state = reactive({
  email: '',
})

// this schema should probably be moved to shared/schema.ts
const schema = z.object({
  email: z.email(), // this is correct using `z.email()` since we use zod v4
})

const schemaIsValid = computed(() => schema.safeParse(state).success)

const onLoginWithPasskey = async () => {
  if (isLoading.value || !schemaIsValid.value) {
    return
  }

  isLoading.value = true

  try {
    const authenticated = await authenticate(state.email)
    if (!authenticated) {
      throw new Error('Failed to verify passkey authentication')
    }

    await fetchSession()
    $emits('close', true)
  } catch (err: unknown) {
    useToast().add(errorToToast(err, {
      title: 'Failed to login with passkey',
    }))
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal title="Login with Passkey">
    <template #body>
      <AutoFormPrimitive
        :state="state"
        :schema="schema"
      />
    </template>
    <template #footer>
      <UButton
        label="Close"
        :disabled="isLoading"
        @click="$emit('close', false)"
      />
      <UButton
        v-if="isSupported"
        :loading="isLoading"
        :disabled="!schemaIsValid"
        label="Login with Passkey"
        @click="onLoginWithPasskey"
      />
    </template>
  </UModal>
</template>
