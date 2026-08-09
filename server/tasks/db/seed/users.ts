import type { UserInsert } from '@nuxthub/db/schema'
import { createUser } from '#server/utils/user.ts'

export default defineTask({
  meta: {
    name: 'db:seed:users',
  },
  async run() {
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

    return {
      result: {
        users: createdUsers.map((user) => {
          return user.id
        }),
      },
    }
  },
})
