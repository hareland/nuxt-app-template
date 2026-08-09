export default defineEventHandler(async (event) => {
  // Only applied on admin routes...
  if (!event.path.startsWith('/admin')) {
    return
  }

  const user = await requireUser(event)

  if (userHasRole(user, 'admin')) {
    return
  }

  throw createError({
    status: 403,
    message: 'Forbidden',
  })
})
