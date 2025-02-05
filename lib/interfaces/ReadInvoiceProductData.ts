import { IInvoiceProduct, IProduct } from '@/lib/interfaces'
interface IReadInvoiceProductData
  extends Omit<IProduct, 'id'>,
    Omit<IInvoiceProduct, 'invoiceId'> {}

export default IReadInvoiceProductData
