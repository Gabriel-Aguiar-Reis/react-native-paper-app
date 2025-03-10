import * as Crypto from 'expo-crypto'

export function generateUniqueCode() {
  return Crypto.randomUUID().slice(0, 8).toUpperCase()
}

const key = '73616E746F73657874696E746F726573'

export async function generateLicenseHash(
  uniqueCode: string,
  blockDate: string
) {
  const data = `${uniqueCode}-${blockDate}-${key}`
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data
  )
  return hash.slice(0, 16).toUpperCase()
}
