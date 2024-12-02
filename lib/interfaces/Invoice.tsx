import { ICostumer, IProduct } from '@/lib/interfaces'

interface IInvoice {
  costumer: ICostumer
  products: IProduct[]
  totalValue: number
  visitDate: Date
  returnDate: Date
}

export default IInvoice
