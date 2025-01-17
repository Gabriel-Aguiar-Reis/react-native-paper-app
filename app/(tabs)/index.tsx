import React, { useEffect, useState } from 'react'
import { Surface } from 'react-native-paper'
import { InvoiceModal, ConfirmVisitModal, InvoiceFlatList } from '@/lib/ui'
import { IInvoiceProduct, IReadInvoiceData } from '@/lib/interfaces'
import { readCostumers } from '@/lib/services/storage/costumerService'
import {
  createInvoice,
  readInvoices
} from '@/lib/services/storage/invoiceService'
import { useSQLiteContext } from 'expo-sqlite'
import { useInvoiceContext } from '@/lib/context/InvoiceContext'

const TabsHome = () => {
  const [visible, setVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<IReadInvoiceData>()
  const db = useSQLiteContext()

  const { invoices, setInvoices } = useInvoiceContext()

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoicesData = await readInvoices(db)
      const costumersData = await readCostumers(db)
      const enrichedInvoices = invoicesData.map((invoice) => {
        const costumer = costumersData.find(
          (costumer) => costumer.id === invoice.costumerId
        )
        return costumer
          ? {
              ...invoice,
              costumerName: costumer.name,
              contactName: costumer.contactName,
              contactPhone: costumer.phone
            }
          : invoice
      })
      setInvoices(enrichedInvoices)
    }
    fetchInvoices()
  }, [])

  const showModal = (invoice: IReadInvoiceData) => {
    setSelectedInvoice(invoice)
    setVisible(true)
  }

  const hideModal = () => {
    setVisible(false)
    setSelectedInvoice(undefined)
  }

  const handleConfirmVisit = () => {
    setVisible(false)
    setConfirmVisible(true)
  }

  const handleAction = async (action: 'generate' | 'cancel' | 'close') => {
    if (!selectedInvoice) return

    try {
      if (action === 'generate') {
        // Calcula a diferença em dias entre as datas originais
        const [visitDay, visitMonth, visitYear] = selectedInvoice.visitDate
          .split('/')
          .map(Number)
        const [returnDay, returnMonth, returnYear] = selectedInvoice.returnDate
          .split('/')
          .map(Number)

        const originalVisitDate = new Date(visitYear, visitMonth - 1, visitDay)
        const originalReturnDate = new Date(
          returnYear,
          returnMonth - 1,
          returnDay
        )

        const differenceInMs =
          originalReturnDate.getTime() - originalVisitDate.getTime()
        const differenceInDays = Math.ceil(
          differenceInMs / (1000 * 60 * 60 * 24)
        )

        // Nova visita começa na data de retorno original
        const newVisitDate = originalReturnDate

        // Nova data de retorno é a nova data de visita + diferença em dias
        const newReturnDate = new Date(
          newVisitDate.getFullYear(),
          newVisitDate.getMonth(),
          newVisitDate.getDate() + differenceInDays
        )

        // Formatar datas para o formato brasileiro
        const formattedNewVisitDate = newVisitDate.toLocaleDateString('pt-BR')
        const formattedNewReturnDate = newReturnDate.toLocaleDateString('pt-BR')

        // Atualize o invoice antigo para "realized = 1"
        await db.execAsync(`
          UPDATE invoices
          SET realized = 1
          WHERE id = ${selectedInvoice.id};
        `)

        // Obtenha os produtos associados ao invoice antigo
        const oldProducts = (await db.getAllAsync(
          `
          SELECT productId, quantity
          FROM invoice_products
          WHERE invoiceId = ?;
          `,
          [selectedInvoice.id]
        )) as IInvoiceProduct[]

        // Crie um novo invoice
        const newInvoice = (await createInvoice(
          {
            costumerId: selectedInvoice.costumerId,
            visitDate: formattedNewVisitDate,
            returnDate: formattedNewReturnDate,
            totalValue: selectedInvoice.totalValue,
            realized: 0,
            products: oldProducts
          },
          db
        )) as IReadInvoiceData

        // Atualize o estado do contexto
        setInvoices((prev) => [
          ...prev.map((invoice) =>
            invoice.id === selectedInvoice.id
              ? { ...invoice, realized: 1 as const }
              : invoice
          ),
          newInvoice
        ])

        console.log('Novo invoice criado com sucesso!')
      } else if (action === 'cancel') {
        await db.execAsync(`
          UPDATE invoices
          SET realized = 2
          WHERE id = ${selectedInvoice.id};
        `)

        setInvoices((prev) =>
          prev.map((invoice) =>
            invoice.id === selectedInvoice.id
              ? { ...invoice, realized: 2 as const }
              : invoice
          )
        )

        console.log('Fatura cancelada!')
      }
    } catch (error) {
      console.error('Erro durante a transação:', error)
    }

    setConfirmVisible(false)
    setSelectedInvoice(undefined)
  }

  return (
    <Surface>
      <InvoiceFlatList invoices={invoices} onPressItem={showModal} />
      <InvoiceModal
        visible={visible}
        onDismiss={hideModal}
        onConfirmVisit={handleConfirmVisit}
        data={selectedInvoice}
      />
      {confirmVisible && (
        <ConfirmVisitModal visible={confirmVisible} onAction={handleAction} />
      )}
    </Surface>
  )
}

export default TabsHome
