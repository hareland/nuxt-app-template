import type { APIUser } from './types'

declare module '#auth-utils' {
  interface User extends APIUser {
    // Add custom properties here
    role: APIUser['role']
  }
}
