import ICostumer from '@/lib/interfaces/Costumer'
import IInvoice from '@/lib/interfaces/Invoice'
import IProduct from '@/lib/interfaces/Product'

interface IFilters {
  costumerIds?: ICostumer['id'][]
  productIds?: IProduct['id'][]
  realizedIds?: IInvoice['realized'][]
  startDate?: Date
  endDate?: Date
}

export default IFilters
