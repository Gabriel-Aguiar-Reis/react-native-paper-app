import ICostumer from '@/lib/interfaces/Costumer'
import IInvoice from '@/lib/interfaces/Invoice'
import IProduct from '@/lib/interfaces/Product'

interface IFilters {
  costumerIds?: ICostumer['id'][]
  productIds?: IProduct['id'][]
  realizedIds?: IInvoice['realized'][]
  startDateVisit?: Date
  endDateVisit?: Date
  startDateReturn?: Date
  endDateReturn?: Date
  paidIds?: IInvoice['paid'][]
}

export default IFilters
