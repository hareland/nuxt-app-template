import type { UserSelect } from '@nuxthub/db/schema'
import type { APIUser } from '#shared/types'

export const mapUserToSession = (user: UserSelect): APIUser => {
  return {
    ...user,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    createdAt: user.createdAt?.toISOString() ?? null,
    updatedAt: user.updatedAt?.toISOString() ?? null,
    acceptedTermsAt: user.acceptedTermsAt?.toISOString() ?? null,
    acceptedPrivacyAt: user.acceptedPrivacyAt?.toISOString() ?? null,
  }
}
