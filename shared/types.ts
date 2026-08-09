import type {
  UserSelect,
} from '@nuxthub/db/schema'
import type { UserRole } from '#shared/schema'

export type DateToString<T> = T extends Date
  ? string
  : T extends null
    ? null
    : T extends object
      ? { [K in keyof T]: DateToString<T[K]> }
      : T

export type APIUser = DateToString<Omit<UserSelect, 'role'> & { role: UserRole }>
