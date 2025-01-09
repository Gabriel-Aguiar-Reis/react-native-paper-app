import { ICategory } from '@/lib/interfaces'

interface IProduct {
  id: number
  name: string
  price: number
  validityMonths: number
  categoryName: ICategory['name']
}

export default IProduct
