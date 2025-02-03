import { ICostumer } from '@/lib/interfaces'

interface IInvoice {
  id: number
  costumerId: ICostumer['id']
  totalValue: number
  visitDate: string
  returnDate: string
  realized: 0 | 1 | 2
  paymentMethod: string | undefined
  deadline: string | undefined
  paid: 0 | 1 | undefined
}

export default IInvoice
