import { kv } from '@nuxthub/kv'
import { getBaseCurrency } from '#shared/utils/currency'

const CACHE_TTL = 60 * 60 * 24 // 24 hours

const getCacheTtl = () => {
  return import.meta.dev ? 30 : CACHE_TTL
}

const currencyKey = (code: string) => `currency:${code.toUpperCase()}`

interface FrankfurterQuote {
  date: string | 'YYYY-MM-DD'
  base: string
  quote: string
  rate: number
}

export const fetchLiveCurrencyQuotes = async (base: string, quotes: string[] = []) => {
  const response = await $fetch<FrankfurterQuote[]>(
    `https://api.frankfurter.dev/v2/rates?base=${base.toUpperCase()}${quotes.length > 0 ? `&quotes=${quotes.join(',')}` : ''}`,
  )

  return Object.fromEntries(response.map(q => [q.quote, q.rate]))
}

/**
 * Resolves EUR-based rates for a set of currency codes, hitting the cache
 * once (single getItems call) and doing at most one batched live fetch
 * for whatever's missing/expired.
 */
const resolveRates = async (codes: string[]): Promise<Record<string, number>> => {
  const BASE_CURRENCY = getBaseCurrency()
  const rates: Record<string, number> = { [BASE_CURRENCY]: 1 }

  const codesToLookup = [...new Set(codes.map(c => c.toUpperCase()))].filter(
    code => code !== BASE_CURRENCY,
  )

  if (codesToLookup.length === 0) return rates

  const items = await kv.getItems<number>(codesToLookup.map(currencyKey))
  const found = new Map(items.map(item => [item.key, item.value]))

  const missing: string[] = []
  for (const code of codesToLookup) {
    const value = found.get(currencyKey(code))
    if (value != null) {
      rates[code] = value
    } else {
      missing.push(code)
    }
  }

  if (missing.length > 0) {
    const quotes = await fetchLiveCurrencyQuotes(BASE_CURRENCY, missing)

    for (const code of missing) {
      const rate = quotes[code]
      if (!rate) {
        throw new Error(`Unable to resolve rate for currency ${code}`)
      }
      rates[code] = rate
      await kv.set(currencyKey(code), rate, { ttl: getCacheTtl() })
    }
  }

  return rates
}

export const convertCurrency = async (from: string, to: string, amount: number) => {
  const fromUpper = from.toUpperCase()
  const toUpper = to.toUpperCase()

  const rates = await resolveRates([fromUpper, toUpper])

  const fromRate = rates[fromUpper]
  const toRate = rates[toUpper]
  if (typeof fromRate !== 'number' || typeof toRate !== 'number') {
    throw new Error(`Invalid currency pair ${fromUpper} => ${toUpper}`)
  }

  const amountInBase = amount / fromRate
  return amountInBase * toRate
}

export interface CurrencyConversionRequest<T = unknown> {
  from: string
  to: string
  amount: number
  meta?: T
}

export interface CurrencyConversionResult<T = unknown> extends CurrencyConversionRequest<T> {
  convertedAmount: number
}

/**
 * Batch version: resolves every currency needed across the whole list
 * in one cache read (+ at most one live fetch for anything missing),
 * then converts each item in memory — no per-item cache hits.
 */
export const convertCurrencies = async <T = unknown>(
  items: CurrencyConversionRequest<T>[],
): Promise<CurrencyConversionResult<T>[]> => {
  const codes = items.flatMap(item => [item.from.toUpperCase(), item.to.toUpperCase()])
  const rates = await resolveRates(codes)

  return items.map((item) => {
    const fromUpper = item.from.toUpperCase()
    const toUpper = item.to.toUpperCase()

    const fromRate = rates[fromUpper]
    const toRate = rates[toUpper]
    if (typeof fromRate !== 'number' || typeof toRate !== 'number') {
      throw new Error(`Invalid currency pair ${fromUpper} => ${toUpper}`)
    }

    const amountInBase = item.amount / fromRate
    return { ...item, convertedAmount: amountInBase * toRate }
  })
}
