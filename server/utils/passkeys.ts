import type { WebAuthnCredential } from '#auth-utils'
import { and, eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import { kv } from '@nuxthub/kv'

const PASSKEY_CHALLENGE_TTL_MS = 5 * 60 * 1000

export interface StoredPasskey extends WebAuthnCredential {
  createdAt: string
}

const passkeyAttemptStorageKey = (attemptId: string) => `passkeys:attempt:${attemptId}`

export const listUserPasskeys = async (userId: string): Promise<StoredPasskey[]> => {
  const passkeys = await db.query.userPasskey.findMany({
    where: (t, { eq: eqFn }) => eqFn(t.userId, userId),
    orderBy: (t, { asc }) => asc(t.createdAt),
  })

  return passkeys.map((passkey) => {
    return {
      ...(passkey.credential as WebAuthnCredential),
      createdAt: passkey.createdAt.toISOString(),
    }
  })
}

export const storePasskeyChallenge = async (attemptId: string, challenge: string) => {
  await kv.set(passkeyAttemptStorageKey(attemptId), challenge, {
    ttl: Math.ceil(PASSKEY_CHALLENGE_TTL_MS / 1000),
  })
}

export const takePasskeyChallenge = async (attemptId: string): Promise<string> => {
  const key = passkeyAttemptStorageKey(attemptId)
  const challenge = await kv.get<string>(key)
  await kv.del(key)

  if (!challenge) {
    throw createError({ statusCode: 400, message: 'Challenge expired' })
  }

  return challenge
}

export const addUserPasskey = async (userId: string, credential: WebAuthnCredential) => {
  await db.insert(schema.userPasskey).values({
    id: credential.id,
    userId,
    credential: credential as Record<string, unknown>,
  })
    .onConflictDoUpdate({
      target: schema.userPasskey.id,
      set: { credential: credential as Record<string, unknown> },
      setWhere: eq(schema.userPasskey.userId, userId),
    })

  const upserted = await db.query.userPasskey.findFirst({
    where: (t, { and: andFn, eq: eqFn }) => andFn(
      eqFn(t.id, credential.id),
      eqFn(t.userId, userId),
    ),
  })

  if (!upserted) {
    throw createError({ statusCode: 400, message: 'Passkey already belongs to another account' })
  }
}

export const deleteUserPasskey = async (userId: string, passkeyId: string) => {
  const [deleted] = await db.delete(schema.userPasskey)
    .where(and(
      eq(schema.userPasskey.userId, userId),
      eq(schema.userPasskey.id, passkeyId),
    ))
    .returning({ id: schema.userPasskey.id })

  if (!deleted) {
    throw createError({ statusCode: 404, message: 'Passkey not found' })
  }
}
