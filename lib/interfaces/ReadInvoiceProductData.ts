import { IInvoiceProduct, IProduct } from '@/lib/interfaces'
interface IReadInvoiceProductData
  extends IProduct,
    Omit<IInvoiceProduct, 'invoiceId'> {}

export default IReadInvoiceProductData
