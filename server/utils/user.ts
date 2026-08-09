import { db, schema } from '@nuxthub/db'
import type { UserInsert } from '@nuxthub/db/schema'
import { objectOmit } from '@vueuse/core'
import defu from 'defu'

export type RequiredCreateUserProps = 'name' | 'email'
export type CreateUserProps = Pick<UserInsert, RequiredCreateUserProps> & Partial<Omit<UserInsert, RequiredCreateUserProps>>

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
