import { ICostumer } from '@/lib/interfaces'

interface IInvoice {
  id: number
  costumerId: ICostumer['id']
  totalValue: number
  visitDate: string
  returnDate: string
  realized: 0 | 1 | 2
  paymentMethod: string
  deadline: string | undefined
  paid: 0 | 1
}

export default IInvoice
