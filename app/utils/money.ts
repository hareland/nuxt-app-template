import { getBaseCurrency } from '#shared/utils/currency.ts'
import { fromCents } from '#shared/utils/money.ts'

export const presentCurrency = (
  amount: number,
  currency?: string,
  locale: string = 'en',
) => {
  if (!currency) {
    currency = getBaseCurrency()
  }
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(fromCents(amount))
}
