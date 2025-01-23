import React, { createContext, useContext, useState } from 'react'
import {
  IFilters,
  IInvoiceContextProps,
  IReadInvoiceData
} from '@/lib/interfaces'

const InvoiceContext = createContext<IInvoiceContextProps | undefined>(
  undefined
)

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [invoices, setInvoices] = useState<IReadInvoiceData[]>([])
  const [originalInvoices, setOriginalInvoices] = useState<IReadInvoiceData[]>(
    []
  )
  const [currentFilters, setCurrentFilters] = useState<{
    costumerIds?: number[]
    productIds?: number[]
    realizedIds?: (0 | 1 | 2)[]
    startDate?: Date
    endDate?: Date
  }>({})

  const addInvoice = (newInvoice: IReadInvoiceData) => {
    setInvoices((prev) => [...prev, newInvoice])
  }

  const removeInvoice = (id: number) => {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
  }

  const filterInvoices = (filters: IFilters) => {
    setCurrentFilters(filters)
    setInvoices(originalInvoices)
    setInvoices((prev) =>
      prev.filter((invoice) => {
        let matches = true

        if (filters.costumerIds && filters.costumerIds.length > 0) {
          matches = matches && filters.costumerIds.includes(invoice.costumerId)
        }

        if (filters.productIds && filters.productIds.length > 0) {
          matches =
            matches &&
            invoice.products.some((p) => filters.productIds?.includes(p.id))
        }

        if (filters.realizedIds && filters.realizedIds.length > 0) {
          matches = matches && filters.realizedIds.includes(invoice.realized)
        }

        if (filters.startDate && filters.endDate) {
          const invoiceDate = new Date(
            invoice.returnDate.split('/').reverse().join('-')
          )
          matches =
            matches &&
            invoiceDate >= filters.startDate &&
            invoiceDate <= filters.endDate
        }

        return matches
      })
    )
  }

  const resetFilters = () => {
    setInvoices([...originalInvoices])
  }

  const getSortedInvoices = () => {
    return [...invoices].sort((a, b) => {
      const [dayA, monthA, yearA] = a.returnDate.split('/').map(Number)
      const [dayB, monthB, yearB] = b.returnDate.split('/').map(Number)

      const dateA = new Date(yearA, monthA - 1, dayA)
      const dateB = new Date(yearB, monthB - 1, dayB)

      return dateA.getTime() - dateB.getTime()
    })
  }

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        setInvoices,
        removeInvoice,
        filterInvoices,
        resetFilters,
        originalInvoices,
        setOriginalInvoices,
        getSortedInvoices,
        currentFilters,
        setCurrentFilters
      }}
    >
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
