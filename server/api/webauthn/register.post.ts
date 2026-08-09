import { z } from 'zod/v4'
import { addUserPasskey, listUserPasskeys, storePasskeyChallenge, takePasskeyChallenge } from '#server/utils/passkeys'

const registerPasskeySchema = z.object({
  userName: z.email().trim(),
  displayName: z.string().trim().optional(),
})

export default defineWebAuthnRegisterEventHandler({
  async storeChallenge(_event, challenge, attemptId) {
    await storePasskeyChallenge(attemptId, challenge)
  },
  async getChallenge(_event, attemptId) {
    return takePasskeyChallenge(attemptId)
  },
  async validateUser(userBody, event) {
    const { user: sessionUser } = await requireUserSession(event)
    const payload = registerPasskeySchema.parse(userBody)

    if (!sessionUser.email || sessionUser.email !== payload.userName) {
      throw createError({ statusCode: 400, message: 'Passkeys can only be added to the signed-in account' })
    }

    return {
      userName: payload.userName,
      displayName: payload.displayName || sessionUser.name || payload.userName,
    }
  },
  async excludeCredentials(event, userName) {
    const { user: sessionUser } = await requireUserSession(event)
    if (!sessionUser.email || sessionUser.email !== userName) {
      throw createError({ statusCode: 400, message: 'Passkeys can only be added to the signed-in account' })
    }

    const passkeys = await listUserPasskeys(sessionUser.id)
    return passkeys.map(passkey => ({ id: passkey.id }))
  },
  async onSuccess(event, { credential, user }) {
    const { user: sessionUser } = await requireUserSession(event)
    if (!sessionUser.email || sessionUser.email !== user.userName) {
      throw createError({ statusCode: 400, message: 'Passkeys can only be added to the signed-in account' })
    }

    await addUserPasskey(sessionUser.id, credential)
  },
})
