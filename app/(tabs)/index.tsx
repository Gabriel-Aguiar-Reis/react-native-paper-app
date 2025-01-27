import React, { useState } from 'react'
import { Surface, Text } from 'react-native-paper'
import {
  InvoiceModal,
  ConfirmVisitModal,
  DraggableInvoiceFlatList,
  styles
} from '@/lib/ui'
import { IInvoiceProduct, IReadInvoiceData } from '@/lib/interfaces'
import { createInvoice } from '@/lib/services/storage/invoiceService'
import { useSQLiteContext } from 'expo-sqlite'
import { useInvoiceContext } from '@/lib/context/InvoiceContext'
import { Linking } from 'react-native'

const TabsHome = () => {
  const [visible, setVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<IReadInvoiceData>()
  const db = useSQLiteContext()

  const {
    indexInvoices,
    setIndexInvoices,
    setInvoices,
    handleReorder,
    updatedInvoicePaid
  } = useInvoiceContext()

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

  const handleConfirmPayment = async () => {
    if (selectedInvoice !== undefined) {
      updatedInvoicePaid(selectedInvoice)
    }
    setVisible(false)
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
            products: oldProducts,
            paymentMethod: selectedInvoice.paymentMethod,
            deadline: selectedInvoice.deadline,
            paid: 0
          },
          db
        )) as IReadInvoiceData

        setIndexInvoices((prev) => [
          ...prev.map((invoice) =>
            invoice.id === selectedInvoice.id
              ? { ...invoice, realized: 1 as const }
              : invoice
          )
          // newInvoice
        ])

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

        setIndexInvoices((prev) =>
          prev.map((invoice) =>
            invoice.id === selectedInvoice.id
              ? { ...invoice, realized: 2 as const }
              : invoice
          )
        )

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

  if (indexInvoices.length === 0) {
    return (
      <Surface style={styles.indexScreen}>
        <Text>Não há ordens de visita para esta filtragem!</Text>
      </Surface>
    )
  }

  const handleMessage = () => {
    const text =
      'Ol%C3%A1%2C%20tudo%20bem%3F%0A%0AAqui%20%C3%A9%20o%20Santos%2C%20da%20Santos%20Extintores%2C%20estou%20te%20enviando%20essa%20mensagem%20para%20lembrar%20que%20esse%20m%C3%AAs%20irei%20te%20atender%21'
    Linking.openURL(`https://wa.me/55${selectedInvoice?.phone}?text=${text}`)
  }

  return (
    <Surface>
      <DraggableInvoiceFlatList
        invoices={indexInvoices}
        onPressItem={showModal}
        onReorder={handleReorder}
      />
      <InvoiceModal
        visible={visible}
        onDismiss={hideModal}
        onConfirmVisit={handleConfirmVisit}
        onConfirmPayment={handleConfirmPayment}
        data={selectedInvoice}
        handleMessage={handleMessage}
      />
      {confirmVisible && (
        <ConfirmVisitModal visible={confirmVisible} onAction={handleAction} />
      )}
    </Surface>
  )
}

export default TabsHome
