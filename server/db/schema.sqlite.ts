//
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import type { UserRole } from '#shared/schema'
import { userRoles } from '#shared/schema'
import { createDomainId } from '#shared/utils'

const withTimestamps = {
  createdAt: integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer({ mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
}

const domainId = (prefix?: string) => {
  return text().primaryKey().$defaultFn(() => createDomainId(prefix))
}

export const user = sqliteTable('users', {
  id: domainId('user_'),
  name: text('name'),
  email: text('email').notNull().unique(),
  role: text('type', { enum: userRoles }).notNull().$type<UserRole>().default('user'),
  settings: text('settings', { mode: 'json' }).$type<{
    locale?: string | null
    currency?: string | null
  }>(),
  lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
  emailVerifiedAt: integer('email_verified_at', { mode: 'timestamp' }),
  acceptedTermsAt: integer('accepted_terms_at', { mode: 'timestamp' }),
  acceptedPrivacyAt: integer('accepted_privacy_at', { mode: 'timestamp' }),
  ...withTimestamps,
})

export const userPasskey = sqliteTable('user_passkeys', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  credential: text('credential', { mode: 'json' }).$type<Record<string, unknown>>().notNull(),
  ...withTimestamps,
}, t => [
  index('user_passkey_user_idx').on(t.userId),
])

export const userRelations = relations(user, ({ many }) => ({
  passkeys: many(userPasskey),
}))

// types
export type UserInsert = typeof user.$inferInsert
export type UserSelect = typeof user.$inferSelect
export type UserPasskeyInsert = typeof userPasskey.$inferInsert
export type UserPasskeySelect = typeof userPasskey.$inferSelect
