import { IFilters, IReadInvoiceData } from '@/lib/interfaces'

interface IInvoiceContextProps {
  invoices: IReadInvoiceData[]
  addInvoice: (newInvoice: IReadInvoiceData) => void
  setInvoices: React.Dispatch<React.SetStateAction<IReadInvoiceData[]>>
  removeInvoice: (id: number) => void
  filterInvoices: (filters: IFilters) => void
  resetFilters: () => void
  originalInvoices: IReadInvoiceData[]
  setOriginalInvoices: React.Dispatch<React.SetStateAction<IReadInvoiceData[]>>
  currentFilters: IFilters
  setCurrentFilters: React.Dispatch<React.SetStateAction<IFilters>>
}

export default IInvoiceContextProps
