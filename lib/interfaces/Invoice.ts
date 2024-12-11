import { ICostumer, IProduct } from '@/lib/interfaces'

interface IInvoice {
  id: string
  costumer: ICostumer
  products: { product: IProduct; quantity: number }[]
  totalValue: number
  visitDate: string
  returnDate: string
}

export default IInvoice
