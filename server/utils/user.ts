import { db, schema } from '@nuxthub/db'
import type { UserInsert } from '@nuxthub/db/schema'
import { objectOmit } from '@vueuse/core'
import defu from 'defu'
import type { APIUser } from '#shared/types.ts'
import { userSettingsSchema } from '#shared/schema'
import { eq } from 'drizzle-orm'

export type RequiredCreateUserProps = 'name' | 'email'
export type CreateUserProps
  = Pick<UserInsert, RequiredCreateUserProps>
    & Partial<Omit<UserInsert, RequiredCreateUserProps>>

export const getUserById = (id: APIUser['id']) => db.query.user.findFirst({ where: (t, { eq }) => eq(t.id, id) })

export const getUserByEmail = (email: APIUser['email']) => db.query.user.findFirst({ where: (t, { eq }) => eq(t.email, email) })

export const createUser = async (props: CreateUserProps) => {
  const userToCreate: UserInsert = defu(props, <Omit<UserInsert, RequiredCreateUserProps>>{
    role: 'user',
    settings: {
      locale: 'en',
      currency: 'EUR',
    },
  })

  const [createdUser] = await db.insert(schema.user)
    .values(userToCreate)
    .onConflictDoUpdate({
      target: schema.user.id,
      set: objectOmit(userToCreate, ['id']),
    })
    .returning()

  if (!createdUser) {
    throw new Error('Failed to create user')
  }

  return createdUser
}

export const updateUserById = async (id: APIUser['id'], props: Partial<UserInsert>) => {
  return db.update(schema.user)
    .set(props)
    .where(eq(schema.user.id, id))
    .returning()
    .get()
}
