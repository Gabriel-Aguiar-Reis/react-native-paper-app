import { IReadInvoiceData, IStoredInvoices } from '@/lib/interfaces'
import { GenericRepository } from '@/lib/services/storage/genericRepository'
import { SQLiteDatabase } from 'expo-sqlite'

export async function setStoredInvoices(
  db: SQLiteDatabase,
  invoices: IReadInvoiceData[]
) {
  const storedInvoicesRepo = new GenericRepository<IStoredInvoices>(
    'stored_invoices',
    db
  )
  try {
    const storedInvoices = await storedInvoicesRepo.read()
    if (storedInvoices.length === 0) {
      await storedInvoicesRepo.create({
        value: JSON.stringify(invoices)
      })
    } else {
      await storedInvoicesRepo.update({
        value: JSON.stringify(invoices),
        id: storedInvoices[0].id
      })
    }
  } catch (error) {}
}
export async function getStoredInvoices(
  db: SQLiteDatabase
): Promise<IStoredInvoices> {
  try {
    const res = (await db.getFirstAsync(
      `
        SELECT
          id,
          value
        FROM
          stored_invoices
        `
    )) as IStoredInvoices

    return res
  } catch (error) {
    throw error
  }
}
