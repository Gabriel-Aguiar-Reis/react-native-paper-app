import { IInvoice, IProduct } from '@/lib/interfaces'

interface IInvoiceProduct {
  invoiceId: IInvoice['invId']
  productId: IProduct['proId']
  quantity: number
}

export default IInvoiceProduct
