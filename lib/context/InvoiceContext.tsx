import React, { createContext, useContext, useState } from 'react'
import { IInvoiceContextProps, IReadInvoiceData } from '@/lib/interfaces'

const InvoiceContext = createContext<IInvoiceContextProps | undefined>(
  undefined
)

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [invoices, setInvoices] = useState<IReadInvoiceData[]>([])

  const addInvoice = (newInvoice: IReadInvoiceData) => {
    setInvoices((prev) => [...prev, newInvoice])
  }

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, setInvoices }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export const useInvoiceContext = () => {
  const context = useContext(InvoiceContext)
  if (!context) {
    throw new Error('useInvoiceContext precisar estar num InvoiceProvider')
  }
  return context
}
