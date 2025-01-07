import { ICategory } from '@/lib/interfaces'

interface IProduct {
  proId: number
  proName: string
  price: number
  validityMonths: number
  categoryId: ICategory['catId']
}

export default IProduct
