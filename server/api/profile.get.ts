import { getUserById } from '#server/utils/user.ts'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)

  return getUserById(user.id)
})
