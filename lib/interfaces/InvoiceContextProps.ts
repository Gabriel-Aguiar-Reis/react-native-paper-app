import { IReadInvoiceData } from '@/lib/interfaces'

interface IInvoiceContextProps {
  invoices: IReadInvoiceData[]
  addInvoice: (newInvoice: IReadInvoiceData) => void
  setInvoices: React.Dispatch<React.SetStateAction<IReadInvoiceData[]>>
}

export default IInvoiceContextProps
