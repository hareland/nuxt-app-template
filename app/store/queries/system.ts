import { USER_KEYS } from '../queryKeys.ts'

type Currency = {
  name?: string
  code: string // e.g USD
  symbol: string // e.g $
}

export const useCurrenciesQueryOptions = defineQueryOptions(() => {
  const { $api } = useNuxtApp()

  return {
    key: USER_KEYS.currencies,
    query: () => $api<Currency[]>('/api/currencies.json'),
  }
})

export const useCurrencies = defineQuery(() => useQuery(() => useCurrenciesQueryOptions()))
