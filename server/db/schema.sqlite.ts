//
import { index, integer, sqliteTable, text, customType } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import type { UserRole } from '#shared/schema'
import { userRoles } from '#shared/schema'
import { createDomainId } from '#shared/utils'
import { decryptSync, encryptSync } from '#server/utils/crypto'

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

export function encrypted<TData extends Record<string, unknown> | string>() {
  return customType<{ data: TData, driverData: string }>({
    dataType() {
      return 'text'
    },
    toDriver(value) {
      return encryptSync(value)
    },
    fromDriver(value) {
      return decryptSync<TData>(value)
    },
  })
}

export const user = sqliteTable('users', {
  id: domainId('user_'),
  name: text(),
  email: text().notNull().unique(),
  role: text({ enum: userRoles }).notNull().$type<UserRole>().default('user'),
  settings: text({ mode: 'json' }).$type<{
    locale?: string | null
    currency?: string | null
  }>(),
  lastLoginAt: integer({ mode: 'timestamp' }),
  emailVerifiedAt: integer({ mode: 'timestamp' }),
  acceptedTermsAt: integer({ mode: 'timestamp' }),
  acceptedPrivacyAt: integer({ mode: 'timestamp' }),
  ...withTimestamps,
})

export const userPasskey = sqliteTable('user_passkeys', {
  id: domainId('passkey_'),
  userId: text().notNull().references(() => user.id, { onDelete: 'cascade' }),
  credential: text({ mode: 'json' }).$type<Record<string, unknown>>().notNull(),
  ...withTimestamps,
}, t => [
  index('user_passkey_user_idx').on(t.userId),
])

export const userAccount = sqliteTable('user_accounts', {
  id: domainId('account_'),
  userId: text().notNull().references(() => user.id, { onDelete: 'cascade' }),
  provider: text().notNull(),
  providerAccountId: text().notNull(),
  type: text().notNull(),
  scope: text(),
  accessToken: text(),
  refreshToken: text(),
  expiresAt: integer({ mode: 'timestamp' }),
  tokenType: text('token_type'),
  ...withTimestamps,
})

export const userRelations = relations(user, ({ many }) => ({
  passkeys: many(userPasskey),
  accounts: many(userAccount),
}))

export const userPasskeyRelations = relations(userPasskey, ({ one }) => ({
  user: one(user, {
    fields: [userPasskey.userId],
    references: [user.id],
  }),
}))

export const userAccountRelations = relations(userAccount, ({ one }) => ({
  user: one(user, {
    fields: [userAccount.userId],
    references: [user.id],
  }),
}))

// types
export type UserInsert = typeof user.$inferInsert
export type UserSelect = typeof user.$inferSelect
export type UserPasskeyInsert = typeof userPasskey.$inferInsert
export type UserPasskeySelect = typeof userPasskey.$inferSelect
export type UserAccountInsert = typeof userAccount.$inferInsert
export type UserAccountSelect = typeof userAccount.$inferSelect
