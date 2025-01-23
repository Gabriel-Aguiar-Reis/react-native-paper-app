import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  IFilters,
  IInvoiceContextProps,
  IReadInvoiceData
} from '@/lib/interfaces'
import { readInvoices } from '@/lib/services/storage/invoiceService'
import { useSQLiteContext } from 'expo-sqlite'

const InvoiceContext = createContext<IInvoiceContextProps | undefined>(
  undefined
)

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [invoices, setInvoices] = useState<IReadInvoiceData[]>([])
  const [indexInvoices, setIndexInvoices] = useState<IReadInvoiceData[]>([])
  const [currentFilters, setCurrentFilters] = useState<IFilters>({})

  const db = useSQLiteContext()

  const addInvoice = (newInvoice: IReadInvoiceData) => {
    setInvoices((prev) => [...prev, newInvoice])
    setIndexInvoices((prev) => [...prev, newInvoice])
    filterInvoices(currentFilters)
  }

  const removeInvoice = (id: number) => {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
    setIndexInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
    filterInvoices(currentFilters)
  }

  const filterInvoices = (filters: IFilters) => {
    setCurrentFilters(filters)
    setIndexInvoices(
      invoices.filter((invoice) => {
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
    setIndexInvoices([...invoices])
  }

  useEffect(() => {
    const fetchInvoices = async () => {
      if (invoices.length === 0) {
        const invoicesData = await readInvoices(db)
        setIndexInvoices(invoicesData)
        setInvoices(invoicesData)
      }
    }
    fetchInvoices()
  }, [])

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        setInvoices,
        removeInvoice,
        filterInvoices,
        resetFilters,
        indexInvoices,
        setIndexInvoices,
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
