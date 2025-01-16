import {
  ICreateInvoiceData,
  IInvoice,
  IInvoiceProduct,
  IReadInvoiceData
} from '@/lib/interfaces'
import { readCostumers } from '@/lib/services/storage/costumerService'
import { GenericRepository } from '@/lib/services/storage/genericRepository'
import { SQLiteDatabase } from 'expo-sqlite'

export async function createInvoice(
  invoice: ICreateInvoiceData,
  db: SQLiteDatabase
): Promise<IReadInvoiceData> {
  const invoiceRepo = new GenericRepository<IInvoice>('invoices', db)
  const invoiceProdRepo = new GenericRepository<IInvoiceProduct>(
    'invoice_products',
    db
  )

  try {
    // Criar fatura
    const { insertedRowId: invoiceId } = await invoiceRepo.create({
      costumerId: invoice.costumerId,
      visitDate: invoice.visitDate,
      returnDate: invoice.returnDate,
      totalValue: invoice.totalValue,
      realized: invoice.realized
    })

    // Criar produtos relacionados à fatura
    const invoiceProducts: IInvoiceProduct[] = []
    for (const product of invoice.products) {
      const invoiceProduct = {
        invoiceId,
        productId: product.productId,
        quantity: product.quantity
      }

      await invoiceProdRepo.create(invoiceProduct)
      invoiceProducts.push(invoiceProduct)
    }

    // Buscar fatura criada
    const resultInvoice = (await db.getFirstAsync(
      `
      SELECT
        id,
        costumerId,
        visitDate,
        returnDate,
        totalValue,
        realized
      FROM
        invoices
      WHERE id = ?;
      `,
      [invoiceId]
    )) as IInvoice

    // Buscar cliente relacionado
    const costumers = await readCostumers(db)
    const costumer = costumers.find((c) => c.id === invoice.costumerId)

    if (!costumer) {
      throw new Error(`Cliente com ID ${invoice.costumerId} não encontrado.`)
    }

    // Retornar os dados formatados
    const result: IReadInvoiceData = {
      ...costumer,
      id: resultInvoice.id,
      products: invoiceProducts,
      costumerId: resultInvoice.costumerId,
      totalValue: resultInvoice.totalValue,
      visitDate: resultInvoice.visitDate,
      returnDate: resultInvoice.returnDate,
      realized: resultInvoice.realized
    }

    return result
  } catch (error) {
    throw error
  }
}

export async function readInvoices(
  db: SQLiteDatabase
): Promise<IReadInvoiceData[]> {
  try {
    const invoicesWithCostumers = (await db.getAllAsync(`
      SELECT
        i.id,
        i.costumerId,
        i.totalValue,
        i.visitDate,
        i.returnDate,
        i.realized,
        c.name,
        l.id AS locationId,
        l.street,
        l.number,
        l.neighbourhood,
        l.city,
        l.zipCode,
        t.id AS contactId,
        t.name AS contactName,
        t.phone,
        t.isWhatsapp
      FROM
        invoices i
      INNER JOIN
        costumers c ON i.costumerId = c.id
      LEFT JOIN
        locations l ON c.id = l.costumerId
      LEFT JOIN
        contacts t ON c.id = t.costumerId
    `)) as IReadInvoiceData[]

    for (const invoice of invoicesWithCostumers) {
      const products = (await db.getAllAsync(
        `
        SELECT
          productId,
          quantity
        FROM
          invoice_products
        WHERE
          invoiceId = ?
        `,
        [invoice.id]
      )) as IInvoiceProduct[]

      invoice.products = products
    }

    return invoicesWithCostumers
  } catch (error) {
    throw error
  }
}

// export async function readCostumers(
//   db: SQLiteDatabase
// ): Promise<IReadCostumerData[]> {
//   try {
//     const result = (await db.getAllAsync(`
//         SELECT
//           c.id,
//           c.name,
//           l.id AS locationId,
//           l.street,
//           l.number,
//           l.neighbourhood,
//           l.city,
//           l.zipCode,
//           t.id AS contactId,
//           t.name AS contactName,
//           t.phone,
//           t.isWhatsapp
//         FROM
//           costumers c
//         LEFT JOIN
//           locations l ON c.id = l.costumerId
//         LEFT JOIN
//           contacts t ON c.id = t.costumerId
//       `)) as IReadCostumerData[]

//     const formattedData: IReadCostumerData[] = result.map((row) => ({
//       id: row.id,
//       locationId: row.locationId,
//       contactId: row.contactId,
//       name: row.name,
//       street: row.street,
//       number: row.number,
//       neighbourhood: row.neighbourhood,
//       city: row.city,
//       zipCode: row.zipCode,
//       contactName: row.contactName,
//       phone: row.phone,
//       isWhatsapp: row.isWhatsapp
//     }))

//     return formattedData
//   } catch (error) {
//     throw new Error(`Falha ao buscar clientes: ${error}`)
//   }
// }
