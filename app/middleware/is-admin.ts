import { withQuery } from 'ufo'

export default defineNuxtRouteMiddleware((to) => {
  const { user, loggedIn } = useUserSession()

  if (loggedIn.value && userHasRole(user.value, 'admin')) return

  return navigateTo(withQuery('/login', {
    redirect: to.path,
  }))
})
