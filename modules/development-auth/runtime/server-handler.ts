import { db } from '@nuxthub/db'
import { mapUserToSession } from '#server/utils/session'

export default defineEventHandler(async (event) => {
  // const { email } = event.methodawait readValidatedBody(event, z.object({
  //   email: z.email().optional().nullish(),
  // }).parse)
  // if (!email) {
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

  return sendRedirect(event, '/app')
  // }
  //
  // let userWithEmail = await db.query.user.findFirst({
  //   where: (t, { eq }) => {
  //     return eq(t.email, email)
  //   },
  // })
  //
  // if (!userWithEmail) {
  //   [userWithEmail] = await db.insert(schema.user)
  //     .values({
  //       email,
  //       name: email,
  //
  //     }).returning()
  // }
  //
  // if (!userWithEmail) {
  //   throw createError({
  //     status: 500,
  //     message: 'Failed to create user',
  //   })
  // }
  //
  // await replaceUserSession(event, {
  //   user: mapUserToSession(userWithEmail),
  // })
})
