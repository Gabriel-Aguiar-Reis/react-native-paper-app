import { ICategory } from '@/lib/interfaces'

interface IProduct {
  id: number
  name: string
  price: number
  validityMonths: number
  categoryId: ICategory['id']
}

export default IProduct
