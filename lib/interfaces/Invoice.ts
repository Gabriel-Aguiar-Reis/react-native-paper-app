import { ICostumer } from '@/lib/interfaces'

interface IInvoice {
  id: number
  costumerId: ICostumer['id']
  totalValue: number
  visitDate: string
  returnDate: string
  realized: 0 | 1 | 2
}

export default IInvoice
