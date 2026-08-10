import { db, schema } from '@nuxthub/db'
import type { SQL } from 'drizzle-orm'
import { z } from 'zod/v4'

const querySchema = z.object({
  locale: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
})

export default defineEventHandler(async (event) => {
  await requireUserRole(event, 'admin')

  const { locale, currency } = await getValidatedQuery(event, querySchema.parse)

  return db.query.user.findMany({
    where: (t, { and, eq, sql }) => {
      const filters: SQL[] = []
      if (locale) {
        filters.push(eq(sql`${t.settings}->>'$.locale'`, locale))
      }
      if (currency) {
        filters.push(eq(sql`${t.settings}->>'$.currency'`, currency))
      }

      if (filters.length > 0) {
        return and(...filters)
      }

      return undefined
    },
  })
})
