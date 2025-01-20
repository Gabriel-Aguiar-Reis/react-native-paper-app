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

  const { invoices, setInvoices, setOriginalInvoices, getSortedInvoices } =
    useInvoiceContext()

  useEffect(() => {
    const fetchInvoices = async () => {
      if (invoices.length === 0) {
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
        setOriginalInvoices(enrichedInvoices)
      }
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

        const newVisitDate = originalReturnDate

        const newReturnDate = new Date(
          newVisitDate.getFullYear(),
          newVisitDate.getMonth(),
          newVisitDate.getDate() + differenceInDays
        )

        const formattedNewVisitDate = newVisitDate.toLocaleDateString('pt-BR')
        const formattedNewReturnDate = newReturnDate.toLocaleDateString('pt-BR')

        await db.execAsync(`
          UPDATE invoices
          SET realized = 1
          WHERE id = ${selectedInvoice.id};
        `)

        const oldProducts = (await db.getAllAsync(
          `
          SELECT productId, quantity
          FROM invoice_products
          WHERE invoiceId = ?;
          `,
          [selectedInvoice.id]
        )) as IInvoiceProduct[]

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

  const sortedInvoices = getSortedInvoices()

  return (
    <Surface>
      <InvoiceFlatList invoices={sortedInvoices} onPressItem={showModal} />
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
