import { IProduct } from '@/lib/interfaces'

interface ICreateProductData extends Omit<IProduct, 'id'> {}

export default ICreateProductData
