import { formatDate } from '@vueuse/core'

export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm'
const DATE_FORMAT = 'YYYY-MM-DD'

export const PRESENT_DATETIME_FORMAT = 'HH:mm YYYY-MM-DD'

export const presentDateTime = (
  date?: Date | string | null,
  emptyValue = '',
) => {
  if (!date) return emptyValue
  return formatDate(new Date(date), PRESENT_DATETIME_FORMAT)
}

export const presentDate = (
  date?: Date | string | null,
  emptyValue = '',
) => {
  if (!date) return emptyValue
  return formatDate(new Date(date), DATE_FORMAT)
}

export const presentDaysUntil = (
  date?: Date | string | null,
  emptyValue = 0,
) => {
  if (!date) return emptyValue
  const diff = new Date(date).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
