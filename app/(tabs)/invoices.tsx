import { Surface, TextInput } from 'react-native-paper'
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

  const [searchTerm, setSearchTerm] = useState('')

  const currentInvoices = invoices.filter(
    (invoice) =>
      invoice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.cpf?.includes(searchTerm) ||
      invoice.cnpj?.includes(searchTerm) ||
      invoice.visitDate.includes(searchTerm) ||
      invoice.returnDate.includes(searchTerm)
  )
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
      <TextInput
        label="Pesquisar..."
        mode="outlined"
        style={{ width: '90%', alignSelf: 'center' }}
        onChangeText={(e) => setSearchTerm(e)}
      />
      <InvoiceFlatList invoices={currentInvoices} onPressItem={showModal} />
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
