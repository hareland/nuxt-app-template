import { z } from 'zod/v4'
import { deleteUserPasskey } from '#server/utils/passkeys'

const paramsSchema = z.object({ id: z.string().trim().min(1) })

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse)
  await deleteUserPasskey(user.id, id)
  return { success: true }
})
