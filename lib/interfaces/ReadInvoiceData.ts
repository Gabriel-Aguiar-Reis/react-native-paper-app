import {
  ICreateInvoiceData,
  IInvoice,
  IInvoiceProduct,
  IProduct,
  IReadCostumerData
} from '@/lib/interfaces'

interface IReadInvoiceData
  extends Omit<ICreateInvoiceData, 'products'>,
    IReadCostumerData {
  id: IInvoice['id']
  products: (Omit<IInvoiceProduct, 'invoiceId'> & IProduct)[]
}

export default IReadInvoiceData
