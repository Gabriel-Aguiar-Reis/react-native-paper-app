import { IProduct } from '@/lib/interfaces'

interface IProductContextProps {
  products: IProduct[]
  addProduct: (newProduct: IProduct) => void
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>
}

export default IProductContextProps
