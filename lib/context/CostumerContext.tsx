import React, { createContext, useContext, useState } from 'react'
import { ICostumer, ICostumerContextProps } from '@/lib/interfaces'

const CostumerContext = createContext<ICostumerContextProps | undefined>(
  undefined
)

export const CostumerProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [costumers, setCostumers] = useState<ICostumer[]>([])

  const addCostumer = (newCostumer: ICostumer) => {
    setCostumers((prev) => [...prev, newCostumer])
  }

  return (
    <CostumerContext.Provider value={{ costumers, addCostumer, setCostumers }}>
      {children}
    </CostumerContext.Provider>
  )
}

export const useCostumerContext = () => {
  const context = useContext(CostumerContext)
  if (!context) {
    throw new Error('useCostumerContext precisar estar num CostumerProvider')
  }
  return context
}
