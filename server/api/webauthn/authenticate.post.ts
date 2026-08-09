import type { WebAuthnCredential } from '#auth-utils'
import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { listUserPasskeys, storePasskeyChallenge, takePasskeyChallenge } from '#server/utils/passkeys'
import { mapUserToSession } from '#server/utils/session'

interface StoredUserPasskeyCredential extends WebAuthnCredential {
  userId: string
}

export default defineWebAuthnAuthenticateEventHandler<StoredUserPasskeyCredential>({
  async storeChallenge(_event, challenge, attemptId) {
    await storePasskeyChallenge(attemptId, challenge)
  },
  async getChallenge(_event, attemptId) {
    return takePasskeyChallenge(attemptId)
  },
  async allowCredentials(_event, userName) {
    const user = await db.query.user.findFirst({
      where: (t, { eq: eqFn }) => eqFn(t.email, userName),
    })

    if (!user) {
      return []
    }

    const passkeys = await listUserPasskeys(user.id)
    return passkeys.map(passkey => ({
      id: passkey.id,
      transports: passkey.transports,
    }))
  },
  async getCredential(_event, credentialID) {
    const passkey = await db.query.userPasskey.findFirst({
      where: (t, { eq: eqFn }) => eqFn(t.id, credentialID),
    })

    if (!passkey) {
      throw createError({ statusCode: 404, message: 'Passkey not found' })
    }

    return {
      ...(passkey.credential as WebAuthnCredential),
      userId: passkey.userId,
    }
  },
  async onSuccess(event, { credential }) {
    const [user] = await db.update(schema.user)
      .set({ lastLoginAt: new Date() })
      .where(eq(schema.user.id, credential.userId))
      .returning()

    if (!user) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    await replaceUserSession(event, {
      user: mapUserToSession(user),
    })
  },
})
