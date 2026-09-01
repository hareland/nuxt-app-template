export const USER_KEYS = {
  root: ['user'] as const,
  account: ['user', 'account'] as const,
  dashboard: ['user', 'dashboard'] as const,
  currencies: ['user', 'currencies'] as const,
  passkeys: ['user', 'passkeys'] as const,
  passkeyDetail: (id: string) => [...USER_KEYS.passkeys, id] as const,
}
