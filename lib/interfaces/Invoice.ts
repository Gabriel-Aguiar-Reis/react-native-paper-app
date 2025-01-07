import { ICostumer, IInvoiceProduct } from '@/lib/interfaces'

interface IInvoice {
  invId: number
  costumer: ICostumer
  products: IInvoiceProduct[]
  totalValue: number
  visitDate: Date
  returnDate: Date
  realized: boolean
}

export default IInvoice
