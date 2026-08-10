import type { UserInsert } from '@nuxthub/db/schema'
import { createUser } from '#server/utils/user.ts'
import { db, schema } from '@nuxthub/db'
import { createLogger } from '#shared/utils/logger.ts'
import { objectPick } from '@vueuse/core'

export default defineTask({
  meta: {
    name: 'db:seed:users',
  },
  async run() {
    const logger = createLogger('db:seed:users')
    const users: UserInsert[] = [
      {
        id: 'user_seed_1',
        email: '1@app.localhost',
        name: 'User 1',
        role: 'user',
        settings: {
          locale: 'en',
          currency: 'EUR',
        },
        acceptedTermsAt: new Date(),
        acceptedPrivacyAt: new Date(),
      },
    ]

    const createdUsers = await Promise.all(users.map(user => createUser(user)))

    const createdAccounts = await Promise.all(createdUsers.map(async (user) => {
      const accessToken = Date.now().toString()
      const refreshToken = Date.now().toString()
      const [created] = await db.insert(schema.userAccount)
        .values({
          id: `acc_${user.id}`,
          userId: user.id,
          provider: 'email',
          providerAccountId: user.email,
          type: 'email',
          accessToken,
          refreshToken,
        }).onConflictDoUpdate({
          target: schema.userAccount.id,
          set: {
            userId: user.id,
            accessToken,
            refreshToken,
          },
        }).returning()

      if (!created) {
        throw new Error(`Failed to create/upsert account for user ${user.id}[${JSON.stringify(user)}]`)
      }

      return created
    }))

    const userIdMappedAccounts = Object.fromEntries(
      createdAccounts.map(account => [account.userId!, account]),
    )

    if (import.meta.dev && createdUsers.length > 0) {
      logger.info('Created users: ', createdUsers.map((user) => {
        return `${user.id}: ${JSON.stringify(objectPick(user, ['email', 'name', 'role', 'settings']))}`
      }))
    }

    return {
      result: {
        users: createdUsers.map((user) => {
          if (userIdMappedAccounts[user.id]) {
            return `${user.id}[${userIdMappedAccounts[user.id as keyof typeof userIdMappedAccounts]?.id}]`
          }

          return user.id
        }),
      },
    }
  },
})
