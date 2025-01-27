import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  IFilters,
  IInvoiceContextProps,
  IReadInvoiceData
} from '@/lib/interfaces'
import {
  readInvoices,
  updateInvoicePaid
} from '@/lib/services/storage/invoiceService'
import { useSQLiteContext } from 'expo-sqlite'
import { getFilters, setFilters } from '@/lib/services/storage/filterService'
import { Text } from 'react-native-paper'
import {
  getStoredInvoices,
  setStoredInvoices
} from '@/lib/services/storage/storedInvoiceService'

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

  const handleReorder = async (reorderedInvoices: IReadInvoiceData[]) => {
    try {
      setIndexInvoices(reorderedInvoices)
      await setStoredInvoices(db, reorderedInvoices)
    } catch (error) {
      console.error('Erro ao reordenar:', error)
    }
  }

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

  const filterInvoices = async (filters: IFilters) => {
    try {
      setIsLoading(true)
      setCurrentFilters(filters)
      await setFilters(db, filters)
      const filteredInvoices = invoices.filter((invoice) => {
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
      setIndexInvoices(filteredInvoices)
      await setStoredInvoices(db, filteredInvoices)
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetFilters = async () => {
    try {
      setIsLoading(true)
      setIndexInvoices([...invoices])
      await setStoredInvoices(db, invoices)
      await setFilters(db, {})
    } catch (error) {
      console.error('Erro ao resetar filtros:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatedInvoicePaid = async (data: IReadInvoiceData) => {
    const updatedIndexInvoices = indexInvoices.map((invoice) =>
      invoice.id === data.id ? { ...invoice, paid: 1 as const } : invoice
    )
    await updateInvoicePaid({ db, invoice: data })
    setIndexInvoices(updatedIndexInvoices)
    const invoicesData = await readInvoices(db)
    setInvoices([...invoicesData])
  }

  const [isLoading, setIsLoading] = useState(true)
  const [hasFetchedFilters, setHasFetchedFilters] = useState(false)
  const [hasFetchedInvoices, setHasFetchedInvoices] = useState(false)
  const [hasFetchedStoredInvoices, setHasFetchedStoredInvoices] =
    useState(false)

  useEffect(() => {
    const fetchFiltersAndInvoices = async () => {
      try {
        if (!hasFetchedInvoices) {
          const invoicesData = await readInvoices(db)
          setInvoices([...invoicesData])
          setHasFetchedInvoices(true)
        }
        if (!hasFetchedStoredInvoices) {
          const storedInvoices = await getStoredInvoices(db)
          if (storedInvoices && storedInvoices.value) {
            const parsedInvoices: IReadInvoiceData[] = JSON.parse(
              storedInvoices.value
            )
            if (parsedInvoices.length === 0) {
              setIndexInvoices([...invoices])
            } else {
              setIndexInvoices([...parsedInvoices])
            }
          }
          setHasFetchedStoredInvoices(true)
        }

        // Busca filtros apenas uma vez
        if (!hasFetchedFilters) {
          const filters = await getFilters(db)
          if (filters && filters.value) {
            const parsedFilters: IFilters = JSON.parse(filters.value)

            // Converta os campos de data ao recuperar os filtros
            if (parsedFilters.startDate) {
              parsedFilters.startDate = new Date(parsedFilters.startDate)
            }
            if (parsedFilters.endDate) {
              parsedFilters.endDate = new Date(parsedFilters.endDate)
            }

            setCurrentFilters(parsedFilters)

            if (indexInvoices === invoices) {
              filterInvoices(parsedFilters)
            }
          }
          setHasFetchedFilters(true)
        }
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFiltersAndInvoices()
  })

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
        setCurrentFilters,
        isLoading,
        setIsLoading,
        handleReorder,
        updatedInvoicePaid
      }}
    >
      {!isLoading ? children : <Text>Carregando...</Text>}
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
