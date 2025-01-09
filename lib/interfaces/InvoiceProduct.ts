import { IInvoice, IProduct } from '@/lib/interfaces'

interface IInvoiceProduct {
  invoiceId: IInvoice['id']
  productId: IProduct['id']
  quantity: number
}

export default IInvoiceProduct
