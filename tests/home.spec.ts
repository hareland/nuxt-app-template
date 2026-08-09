import { expect, test } from '@nuxt/test-utils/playwright'

test('home header has sign-in button', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const headerSignInBtn = page.getByRole('banner').getByRole('link', { name: 'Sign In' })
  await expect(headerSignInBtn).toHaveText(/Sign In/)
})
