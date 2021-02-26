import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

export const generateNewHash = (string: string): string => {
  return crypto.createHash('sha256').update(JSON.stringify(string)).digest('hex')
}

export const generateNewUUID = (): string => {
  return uuidv4()
}

export const generateKeyPair = () => {
  const { privateKey, publicKey }: crypto.KeyPairSyncResult<string, string> = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: 'tcoin',
    },
  })

  return { publicKey, privateKey }
}

export function signWithPrivateKey(privateKey: string, buffer: Buffer): Buffer {
  return crypto.sign('sha256', buffer, {
    key: privateKey,
    passphrase: 'tcoin',
  })
}

export function verifySignature(data: Buffer, publicKey: string, signature: Buffer): boolean {
  return crypto.verify('sha256', data, publicKey, signature)
}
