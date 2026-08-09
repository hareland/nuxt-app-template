import { listUserPasskeys } from '#server/utils/passkeys'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  return listUserPasskeys(user.id)
})
