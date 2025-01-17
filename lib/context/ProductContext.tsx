import React, { createContext, useContext, useState } from 'react'
import { IProduct, IProductContextProps } from '@/lib/interfaces'

const ProductContext = createContext<IProductContextProps | undefined>(
  undefined
)

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [products, setProducts] = useState<IProduct[]>([])

  const addProduct = (newProduct: IProduct) => {
    setProducts((prev) => [...prev, newProduct])
  }

  const removeProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  return (
    <ProductContext.Provider
      value={{ products, addProduct, setProducts, removeProduct }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProductContext = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProductContext precisar estar num ProductProvider')
  }
  return context
}
