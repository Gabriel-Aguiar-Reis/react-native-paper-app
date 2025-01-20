import { IReadInvoiceData } from '@/lib/interfaces'

interface IInvoiceContextProps {
  invoices: IReadInvoiceData[]
  addInvoice: (newInvoice: IReadInvoiceData) => void
  setInvoices: React.Dispatch<React.SetStateAction<IReadInvoiceData[]>>
  removeInvoice: (id: number) => void
  filterInvoices: (filters: {
    costumerIds?: number[]
    productIds?: number[]
    realizedIds?: (0 | 1 | 2)[]
    startDate?: Date
    endDate?: Date
  }) => void
  resetFilters: () => void
  originalInvoices: IReadInvoiceData[]
  setOriginalInvoices: React.Dispatch<React.SetStateAction<IReadInvoiceData[]>>
  getSortedInvoices: () => IReadInvoiceData[]
  currentFilters: {
    costumerIds?: number[]
    productIds?: number[]
    realizedIds?: (0 | 1 | 2)[]
    startDate?: Date
    endDate?: Date
  }
  setCurrentFilters: React.Dispatch<
    React.SetStateAction<{
      costumerIds?: number[]
      productIds?: number[]
      realizedIds?: (0 | 1 | 2)[]
      startDate?: Date
      endDate?: Date
    }>
  >
}

export default IInvoiceContextProps
