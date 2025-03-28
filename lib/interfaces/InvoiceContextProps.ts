import { IFilters, IReadInvoiceData } from '@/lib/interfaces'

interface IInvoiceContextProps {
  invoices: IReadInvoiceData[]
  addInvoice: (newInvoice: IReadInvoiceData) => void
  setInvoices: React.Dispatch<React.SetStateAction<IReadInvoiceData[]>>
  removeInvoice: (id: number) => void
  filterInvoices: (filters: IFilters) => void
  resetFilters: () => void
  indexInvoices: IReadInvoiceData[]
  setIndexInvoices: React.Dispatch<React.SetStateAction<IReadInvoiceData[]>>
  currentFilters: IFilters
  setCurrentFilters: React.Dispatch<React.SetStateAction<IFilters>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  handleReorder: (reorderedInvoices: IReadInvoiceData[]) => Promise<void>
  updatedInvoicePaid: (data: IReadInvoiceData) => Promise<void>
}

export default IInvoiceContextProps
