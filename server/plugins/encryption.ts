export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  initEncryptionKeys({
    publicKey: config.publicKey,
    privateKey: config.privateKey,
  })
})
