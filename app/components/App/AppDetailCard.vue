<script setup lang="ts">
import type { AvatarProps } from '@nuxt/ui'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  avatar?: string | AvatarProps
  icon?: string
  copyable?: boolean
  reversed?: boolean
  collapsed?: boolean
}>(), {
  reversed: false,
  collapsed: false,
})

const reverseClasses = computed(() => props.reversed ? ['flex-row-reverse'] : [])
</script>

<template>
  <div
    v-if="collapsed"
    class="rounded-lg border border-default p-3"
  >
    <div
      v-if="$slots.title || title || icon || $slots.actions"
      class="text-sm text-muted flex items-center gap-1.5"
    >
      <UIcon
        v-if="icon"
        :name="icon"
        class="size-4"
      />
      <slot name="title">
        {{ title }}
      </slot>
      <div
        v-if="$slots.actions"
        class="ml-auto"
      >
        <slot name="actions" />
      </div>
    </div>
    <div
      v-if="$slots.default || description"
      class="font-medium mt-1"
    >
      <slot name="default">
        {{ description }}
      </slot>
    </div>
  </div>

  <div
    v-else
    :class="['flex items-center justify-between rounded-lg border border-default p-3', ...reverseClasses]"
  >
    <div :class="['flex items-center gap-3', ...reverseClasses]">
      <slot name="leading">
        <UIcon
          v-if="icon"
          :name="icon"
          class="text-2xl text-muted"
        />
        <UAvatar
          v-else-if="avatar"
          size="md"
          class="bg-elevated"
          :text="typeof avatar === 'string' ? avatar : undefined"
          v-bind="typeof avatar !== 'string' ? avatar : {}"
        />
      </slot>
      <div>
        <div
          v-if="$slots.title || title"
          class="text-sm text-muted"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </div>
        <div
          v-if="$slots.default || description"
          class="font-medium"
        >
          <slot name="default">
            {{ description }}
          </slot>
        </div>
      </div>
    </div>
    <slot name="trailing" />
  </div>
</template>
