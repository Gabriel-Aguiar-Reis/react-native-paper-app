import {
  ICreateInvoiceData,
  IInvoice,
  IReadCostumerData,
  IReadInvoiceProductData
} from '@/lib/interfaces'

interface IReadInvoiceData
  extends Omit<ICreateInvoiceData, 'products'>,
    IReadCostumerData {
  id: IInvoice['id']
  products: IReadInvoiceProductData[]
}

export default IReadInvoiceData
