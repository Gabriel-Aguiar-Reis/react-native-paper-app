import {
  ICreateInvoiceData,
  IInvoice,
  IInvoiceProduct,
  IProduct,
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
      realized: invoice.realized,
      paymentMethod: invoice.paymentMethod,
      deadline: invoice.deadline,
      paid: invoice.paid
    })

    // Criar produtos relacionados à fatura
    for (const product of invoice.products) {
      const invoiceProduct = {
        invoiceId,
        productId: product.productId,
        quantity: product.quantity
      }
      await invoiceProdRepo.create(invoiceProduct)
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
        realized,
        paymentMethod,
        deadline,
        paid
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

    // Buscar produtos relacionados à fatura
    const products = (await db.getAllAsync(
      `
      SELECT
        i.productId,
        i.quantity,
        p.id,
        p.name,
        p.price,
        p.validityMonths,
        p.categoryName
      FROM
        invoice_products i
      INNER JOIN
        products p ON i.productId = p.id
      WHERE
        i.invoiceId = ?;
      `,
      [invoiceId]
    )) as (IInvoiceProduct & IProduct)[]

    // Retornar os dados formatados
    const result: IReadInvoiceData = {
      ...costumer,
      id: resultInvoice.id,
      products,
      costumerId: resultInvoice.costumerId,
      totalValue: resultInvoice.totalValue,
      visitDate: resultInvoice.visitDate,
      returnDate: resultInvoice.returnDate,
      realized: resultInvoice.realized,
      paymentMethod: resultInvoice.paymentMethod,
      deadline: resultInvoice.deadline,
      paid: resultInvoice.paid
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
        i.paymentMethod,
        i.deadline,
        i.paid,
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
          i.productId,
          i.quantity,
          p.id,
          p.name,
          p.price,
          p.validityMonths,
          p.categoryName
        FROM
          invoice_products i
        INNER JOIN
          products p ON i.productId = p.id
        WHERE
          invoiceId = ?
        `,
        [invoice.id]
      )) as (IInvoiceProduct & IProduct)[]

      invoice.products = products
    }

    return invoicesWithCostumers
  } catch (error) {
    throw error
  }
}

export async function deleteInvoice(db: SQLiteDatabase, id: number) {
  try {
    const invoiceRepo = new GenericRepository<IInvoice>('invoices', db)
    const res = await invoiceRepo.destroy(id)
    return res
  } catch (error) {
    throw error
  }
}

export async function updateInvoicePaid({
  db,
  invoice
}: {
  db: SQLiteDatabase
  invoice: IReadInvoiceData
}) {
  try {
    const invoiceRepo = new GenericRepository<IInvoice>('invoices', db)
    await invoiceRepo.update({ id: invoice.id, paid: 1 as const })
  } catch (error) {
    throw error
  }
}
