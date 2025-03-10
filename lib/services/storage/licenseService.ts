import { ILicense } from '@/lib/interfaces'
import { GenericRepository } from '@/lib/services/storage/genericRepository'
import { generateUniqueCode } from '@/lib/utils/cryptograph'
import { SQLiteDatabase } from 'expo-sqlite'

export async function setLicense({
  blockDate,
  db
}: {
  blockDate: ILicense['blockDate']
  db: SQLiteDatabase
}) {
  const licenseRepo = new GenericRepository<ILicense>('licenses', db)
  try {
    const licenses = await licenseRepo.read()
    if (licenses.length === 0) {
      await licenseRepo.create({ blockDate })
    } else {
      await licenseRepo.update({ blockDate, id: licenses[0].id })
    }
  } catch (e) {
    throw e
  }
}

export async function getLicense({ db }: { db: SQLiteDatabase }) {
  const licenseRepo = new GenericRepository<ILicense>('licenses', db)
  try {
    const licenses = await licenseRepo.read()
    if (licenses.length < 1) {
      setLicense({ blockDate: new Date().toLocaleDateString('pt-BR'), db })
    } else {
      return licenses[0]
    }
  } catch (e) {
    throw e
  }
}
