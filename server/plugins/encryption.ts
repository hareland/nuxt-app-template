import { initEncryptionKeyConfig } from '#server/utils/crypto.ts'

export default defineNitroPlugin(() => {
  initEncryptionKeyConfig()
})
