import { z } from 'zod/v4'

export const userRoles = ['admin', 'user'] as const
export type UserRole = typeof userRoles[number]
export type UserRoleQuery = UserRole | '*'

export const userSettingsSchema = z.object({
  locale: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
})

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  settings: userSettingsSchema.optional(),
})
