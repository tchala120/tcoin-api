import crypto from 'crypto'
import { ec } from 'elliptic'
import { v4 as uuidv4 } from 'uuid'

const EC = new ec('secp256k1')

export const generateNewHash = (string: string): string => {
  return crypto.createHash('sha256').update(JSON.stringify(string)).digest('hex')
}

export const generateNewUUID = (): string => {
  return uuidv4()
}

export const generateKeyPair = () => {
  const key = EC.genKeyPair()

  const publicKey = key.getPublic('hex')
  const privateKey = key.getPrivate('hex')

  return { publicKey, privateKey }
}

export const getPrivateKeyWithPublicKey = (publicKey: string): string => {
  const privateKey = EC.keyFromPrivate(publicKey, 'hex')
  return privateKey.getPrivate().toString()
}

export const signWithPrivateKey = (sender: string, dataHash: string): string => {
  const privateKey = EC.keyFromPrivate(sender, 'hex')
  const signature = privateKey.sign(dataHash, 'base64')
  return signature.toDER('hex')
}

export const verifySignature = (dataHash: string, sender: string, signature: string): boolean => {
  if (sender !== null) return true

  if (!signature || signature.length === 0) return false

  const publicKey = EC.keyFromPublic(sender, 'hex')
  return publicKey.verify(dataHash, signature)
}
