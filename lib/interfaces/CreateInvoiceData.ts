import { IInvoice, IInvoiceProduct } from '@/lib/interfaces'

interface ICreateInvoiceData extends Omit<IInvoice, 'id'> {
  products: Omit<IInvoiceProduct, 'invoiceId'>[]
}

export default ICreateInvoiceData
