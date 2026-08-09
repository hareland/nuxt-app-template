import { withQuery } from 'ufo'

export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (loggedIn.value) return

  return navigateTo(withQuery('/login', {
    redirect: to.path,
  }))
})
