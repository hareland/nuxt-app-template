import type { ToastProps } from '@nuxt/ui'

export const errorToToast = (
  error: unknown,
  overrides?: Partial<ToastProps>,
): Partial<ToastProps> => {
  // @ts-expect-error Not properly typed.
  const responseMessage = error && error?.response
  // @ts-expect-error Not properly typed.
    && error.response?._data
  // @ts-expect-error Not properly typed.
    && error.response._data.message
    // @ts-expect-error Not properly typed.
    ? error.response._data.message
    : undefined

  return {
    title: 'Error',
    // @ts-expect-error Not properly typed.
    description: responseMessage || error?.message || 'Unknown error',
    color: 'error',
    icon: 'i-lucide-alert-triangle',
    ...overrides || {},
  }
}
