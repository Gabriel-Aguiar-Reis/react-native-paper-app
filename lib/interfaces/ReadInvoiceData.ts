import {
  ICreateInvoiceData,
  IInvoice,
  IReadCostumerData
} from '@/lib/interfaces'

interface IReadInvoiceData extends ICreateInvoiceData, IReadCostumerData {
  id: IInvoice['id']
}

export default IReadInvoiceData
