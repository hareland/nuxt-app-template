export const getBaseCurrency = () => {
  return useRuntimeConfig().public?.baseCurrency || 'EUR'
}
