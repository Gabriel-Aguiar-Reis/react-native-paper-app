import { Surface } from 'react-native-paper'
import { useSQLiteContext } from 'expo-sqlite'
import {
  deleteInvoice,
  readInvoices
} from '@/lib/services/storage/invoiceService'
import { IReadInvoiceData } from '@/lib/interfaces'
import { useEffect, useState } from 'react'
import { readCostumers } from '@/lib/services/storage/costumerService'
import { InvoiceFlatList, InvoiceModal } from '@/lib/ui'
import { useInvoiceContext } from '@/lib/context/InvoiceContext'

const Invoices = () => {
  const [visible, setVisible] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<IReadInvoiceData>()
  const db = useSQLiteContext()

  const { invoices, removeInvoice } = useInvoiceContext()

  const showModal = (invoice: IReadInvoiceData) => {
    setSelectedInvoice(invoice)
    setVisible(true)
  }

  const hideModal = () => {
    setVisible(false)
    setSelectedInvoice(undefined)
  }

  const handleRemove = async () => {
    if (!selectedInvoice) return
    try {
      await deleteInvoice(db, selectedInvoice.id) // Remoção no banco
      removeInvoice(selectedInvoice.id) // Atualização no contexto
      hideModal()
    } catch (error) {
      console.error('Erro ao remover o invoice:', error)
    }
  }

  return (
    <Surface>
      <InvoiceFlatList invoices={invoices} onPressItem={showModal} />
      <InvoiceModal
        visible={visible}
        onDismiss={hideModal}
        onConfirmRemove={handleRemove}
        data={selectedInvoice}
        isRemovable={true}
      />
    </Surface>
  )
}

export default Invoices
