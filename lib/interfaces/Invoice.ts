import { ICostumer, IInvoiceProduct } from '@/lib/interfaces'

interface IInvoice {
  id: number
  costumer: ICostumer
  products: IInvoiceProduct[]
  totalValue: number
  visitDate: Date
  returnDate: Date
  realized: boolean
}

export default IInvoice
