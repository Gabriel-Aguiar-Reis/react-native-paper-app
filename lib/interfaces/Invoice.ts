import { ICostumer, IProduct } from '@/lib/interfaces'

interface IInvoice {
  id: string
  costumer: ICostumer
  products: IProduct[]
  totalValue: number
  visitDate: string
  returnDate: string
}

export default IInvoice
