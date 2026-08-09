import type { H3Event } from 'h3'
import type { APIUser } from '#shared/types'
import type { UserRoleQuery } from '#shared/schema'

export const requireUser = async (event: H3Event) => {
  const { user } = await requireUserSession(event)

  // TODO: Check for other things on the event possibly?
  return user
}

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

export const requireUserRole = async (event: H3Event, role?: RoleQuery) => {
  const user = await requireUser(event)
  if (!userHasRole(user, role)) {
    throw createError({
      status: 403,
      message: 'Forbidden',
    })
  }

  return user
}
