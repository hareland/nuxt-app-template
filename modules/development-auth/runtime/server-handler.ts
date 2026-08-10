import { db } from '@nuxthub/db'
import { mapUserToSession } from '#server/utils/session'
import type { H3Event } from 'h3'
import { z } from 'zod/v4'

const readBody = (event: H3Event) => {
  let fn: typeof readValidatedBody | typeof getQuery = getQuery

  if (event.method === 'POST') {
    fn = readValidatedBody
  }

  return fn(event, z.object({
    email: z.email().optional().nullable().nullish(),
  }).parse)
}

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  if (!email) {
    // Simply find a seeded user...
    const userToLogin = await db.query.user.findFirst({
      where: (t, { like }) => {
        return like(t.id, '%seed%')
      },
    })

    if (!userToLogin) {
      throw createError({
        status: 404,
        message: 'User not found',
      })
    }

    await replaceUserSession(event, {
      user: mapUserToSession(userToLogin),
    })
  } else {
    // In this case we either find or create a user...
    let userWithEmail = await db.query.user.findFirst({
      where: (t, { eq }) => {
        return eq(t.email, email)
      },
    })

    if (!userWithEmail) {
      userWithEmail = await createUser({
        email,
        name: email,
      })
    }

    if (!userWithEmail) {
      throw createError({
        status: 500,
        message: 'Failed to create user',
      })
    }

    await replaceUserSession(event, {
      user: mapUserToSession(userWithEmail),
    })
  }

  // TODO: Have a shared redirect on auth(success|error) function.
  return sendRedirect(event, '/app')
})
