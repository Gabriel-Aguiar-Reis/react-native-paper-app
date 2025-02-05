import { IInvoiceProduct } from '@/lib/interfaces'
import { GenericRepository } from '@/lib/services/storage/genericRepository'
import { SQLiteDatabase } from 'expo-sqlite'

export async function createInvoiceProduct({
  data,
  db
}: {
  data: Omit<IInvoiceProduct, 'id'>
  db: SQLiteDatabase
}): Promise<IInvoiceProduct> {
  const invoiceProductRepo = new GenericRepository<IInvoiceProduct>(
    'invoice_products',
    db
  )
  try {
    const { insertedRowId: id } = await invoiceProductRepo.create({
      ...data
    })

    const result = (await db.getFirstAsync(
      `
          SELECT
            id,
            invoiceId,
            productId,
            quantity
          FROM 
            invoice_products
          WHERE id = ?;
          `,
      [id]
    )) as IInvoiceProduct

    return result
  } catch (error) {
    throw error
  }
}

export async function updateInvoiceProduct({
  id,
  quantity,
  db
}: {
  id: IInvoiceProduct['id']
  quantity: IInvoiceProduct['quantity']
  db: SQLiteDatabase
}) {
  const invoiceProductRepo = new GenericRepository<IInvoiceProduct>(
    'invoice_products',
    db
  )
  try {
    await invoiceProductRepo.update({ id, quantity })
    console.log('invoiceProduct atualizado com sucesso')
  } catch (error) {
    throw error
  }
}

export async function deleteInvoiceProduct({
  id,
  db
}: {
  id: IInvoiceProduct['id']
  db: SQLiteDatabase
}) {
  const invoiceProductRepo = new GenericRepository<IInvoiceProduct>(
    'invoice_products',
    db
  )
  try {
    await invoiceProductRepo.destroy(id)
  } catch (error) {
    throw error
  }
}
