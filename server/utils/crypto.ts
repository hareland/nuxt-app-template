import { publicEncrypt, privateDecrypt, createCipheriv, createDecipheriv, randomBytes, constants } from 'node:crypto'

let publicKey: string | null = null
let privateKey: string | null = null

export function initEncryptionKeyConfig() {
  const config = useRuntimeConfig()
  initEncryptionKeys({
    publicKey: config.publicKey,
    privateKey: config.privateKey,
  })
}

export function initEncryptionKeys(keys: { publicKey: string, privateKey: string }) {
  publicKey = keys.publicKey
  privateKey = keys.privateKey
}

function requireKeys() {
  if (!publicKey || !privateKey) {
    throw new Error('Encryption keys not initialized — call initEncryptionKeys() at startup')
  }
  return { publicKey, privateKey }
}

const RSA_PADDING = { padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }

export function encryptSync<T>(plaintext: T): string {
  const { publicKey } = requireKeys()

  // 1. Random per-record AES key + IV
  const dataKey = randomBytes(32)
  const iv = randomBytes(12)

  // 2. Encrypt payload with AES-256-GCM
  const cipher = createCipheriv('aes-256-gcm', dataKey, iv)
  const json = JSON.stringify(plaintext)
  const ciphertext = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  // 3. Wrap the AES key with the RSA public key
  const wrappedKey = publicEncrypt({ key: publicKey, ...RSA_PADDING }, dataKey)

  return JSON.stringify({
    ct: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    tag: authTag.toString('base64'),
    wk: wrappedKey.toString('base64'),
  })
}

export function decryptSync<R>(raw: string): R {
  const { privateKey } = requireKeys()
  const { ct, iv, tag, wk } = JSON.parse(raw)

  // Unwrap the AES key using the RSA private key
  const dataKey = privateDecrypt(
    { key: privateKey, ...RSA_PADDING },
    Buffer.from(wk, 'base64'),
  )

  const decipher = createDecipheriv('aes-256-gcm', dataKey, Buffer.from(iv, 'base64'))
  decipher.setAuthTag(Buffer.from(tag, 'base64'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ct, 'base64')),
    decipher.final(),
  ])

  return JSON.parse(decrypted.toString('utf8')) as R
}

export const useEncryption = () => {
  const config = useRuntimeConfig()

  initEncryptionKeys({
    publicKey: config.publicKey,
    privateKey: config.privateKey,
  })

  return {
    encrypt: encryptSync,
    decrypt: decryptSync,
  }
}
