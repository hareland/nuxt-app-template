import type { APIUser } from '#shared/types'
import type { UserRoleQuery } from '#shared/schema'

type GateUserParam = { role: APIUser['role'] } | undefined | null
type RoleQuery = UserRoleQuery[] | UserRoleQuery

export const userHasRole = (
  user?: GateUserParam,
  role: RoleQuery = [],
) => {
  if (!role) return false
  const allowedRoles: RoleQuery[] = Array.isArray(role) ? role : [role]

  // if the role includes '*' we pass it:
  if (allowedRoles.includes('*')) {
    return true
  }

  if (!user || !('role' in user)) return false

  return allowedRoles.includes(user.role)
}
