import { ICategory } from '@/lib/interfaces'

interface IProduct {
  id: string
  name: string
  price: number
  validityMonths: number
  category: ICategory
}

export default IProduct
