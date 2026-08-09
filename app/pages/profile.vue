<script setup lang="ts">
import { titleCase } from 'scule'

const { user } = useUserSession()
const { register, isSupported } = useWebAuthn()
const toast = useToast()
const addingPasskey = ref(false)
const deletingPasskeyIds = ref<Set<string>>(new Set())

interface PasskeyListItem {
  id: string
  backedUp: boolean
  transports?: string[]
  createdAt: string
}

const formatPasskeyId = (id: string) => {
  if (id.length <= 24) {
    return id
  }

  return `${id.slice(0, 12)}…${id.slice(-8)}`
}

const { data: passkeys, pending: passkeysPending, refresh: refreshPasskeys } = await useFetch<PasskeyListItem[]>('/api/profile/passkeys', {
  default: () => [],
})

const addPasskey = async () => {
  if (addingPasskey.value || !user.value?.email) {
    return
  }

  addingPasskey.value = true
  try {
    await register({
      userName: user.value.email,
      displayName: user.value.name || user.value.email,
    })
    await refreshPasskeys()
    toast.add({
      title: 'Passkey added',
      description: 'Your passkey has been saved to your account.',
      color: 'success',
      icon: 'i-lucide-key-round',
    })
  } catch (error) {
    toast.add(errorToToast(error, {
      title: 'Failed to add passkey',
    }))
  } finally {
    addingPasskey.value = false
  }
}

const deletePasskey = async (id: string) => {
  if (deletingPasskeyIds.value.has(id)) {
    return
  }

  deletingPasskeyIds.value.add(id)
  try {
    await $fetch(`/api/profile/passkeys/${id}`, {
      method: 'DELETE',
    })
    await refreshPasskeys()
    toast.add({
      title: 'Passkey removed',
      description: 'The passkey was removed from your account.',
      color: 'success',
      icon: 'i-lucide-trash-2',
    })
  } catch (error) {
    toast.add(errorToToast(error, {
      title: 'Failed to remove passkey',
    }))
  } finally {
    deletingPasskeyIds.value.delete(id)
  }
}
</script>

<template>
  <UContainer>
    <AppPageHeader title="Profile" />
    <UPageBody>
      <UPageCard title="Details">
        <div
          v-if="user"
          class="flex flex-col items-stretch gap-2"
        >
          <UFieldGroup
            v-for="(item, index) in user"
            :key="index"
            class="flex"
            size="lg"
          >
            <UBadge
              class="w-32 justify-center font-bold"
              variant="subtle"
              color="neutral"
            >
              {{ titleCase(index) }}
            </UBadge>
            <NuxtImg
              v-if="String(index) === 'avatar' && item"
              :src="item as string"
              class="w-24 h-24 rounded-full mx-4"
            />
            <UTextarea
              v-else-if="index === 'settings'"
              class="flex-1"
              disabled
              :rows="4"
              autoresize
              :model-value="JSON.stringify(item, null, 2)"
            />
            <UInput
              v-else
              class="flex-1"
              :model-value="(item || 'N/A') as never"
              disabled
            />
          </UFieldGroup>
        </div>
      </UPageCard>
      <UPageCard title="Passkeys">
        <div class="flex flex-col gap-4">
          <p class="text-sm text-muted">
            Add a passkey to sign in faster with your device biometrics or security key.
          </p>
          <div class="flex justify-between items-center gap-2">
            <p class="text-sm text-toned">
              {{ isSupported ? 'This device supports passkeys.' : 'Passkeys are not supported by this device/browser.' }}
            </p>
            <UButton
              label="Add passkey"
              icon="i-lucide-key-round"
              :loading="addingPasskey"
              :disabled="!isSupported || !user?.email || addingPasskey"
              @click="addPasskey"
            />
          </div>
          <USeparator />
          <div
            v-if="passkeysPending"
            class="text-sm text-muted"
          >
            Loading passkeys...
          </div>
          <div
            v-else-if="!passkeys || passkeys.length === 0"
            class="text-sm text-muted"
          >
            No passkeys added yet.
          </div>
          <div
            v-else
            class="flex flex-col gap-2"
          >
            <UCard
              v-for="passkey in passkeys"
              :key="passkey.id"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <p class="font-medium truncate">
                    <span :title="passkey.id">{{ formatPasskeyId(passkey.id) }}</span>
                  </p>
                  <p class="text-sm text-muted mt-1">
                    Added {{ passkey.createdAt ? new Date(passkey.createdAt).toLocaleString() : 'Unknown date' }}
                  </p>
                  <p class="text-sm text-muted mt-1">
                    {{ passkey.backedUp ? 'Backed up' : 'Device-bound' }} · {{ passkey.transports?.join(', ') || 'Unknown transport' }}
                  </p>
                </div>
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  :aria-label="`Remove passkey ${formatPasskeyId(passkey.id)}`"
                  :loading="deletingPasskeyIds.has(passkey.id)"
                  :disabled="deletingPasskeyIds.has(passkey.id)"
                  @click="deletePasskey(passkey.id)"
                />
              </div>
            </UCard>
          </div>
        </div>
      </UPageCard>
    </UPageBody>
  </UContainer>
</template>
