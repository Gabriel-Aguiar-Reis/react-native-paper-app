import { ICostumer } from '@/lib/interfaces'

interface IInvoice {
  id: number
  costumerId: ICostumer['id']
  totalValue: number
  visitDate: Date
  returnDate: Date
  realized: boolean
}

export default IInvoice
