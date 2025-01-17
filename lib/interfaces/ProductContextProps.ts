import { IProduct } from '@/lib/interfaces'

interface IProductContextProps {
  products: IProduct[]
  addProduct: (newProduct: IProduct) => void
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>
  removeProduct: (id: number) => void
}

export default IProductContextProps
