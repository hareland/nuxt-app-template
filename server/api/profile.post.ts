import { updateUserSchema } from '#shared/schema'
import { updateUserById } from '#server/utils/user.ts'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const payload = await readValidatedBody(event, updateUserSchema.parse)

  const updatedUser = await updateUserById(user.id, payload)

  await setUserSession(event, {
    user: mapUserToSession(updatedUser),
  })

  return updatedUser
})
