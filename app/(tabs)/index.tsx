import React, { useState } from 'react'
import { DataTable, Surface, TouchableRipple } from 'react-native-paper'
import { OrderModal, ConfirmVisitModal, styles } from '@/lib/ui'
import { IInvoice } from '@/lib/interfaces'
import { mockInvoices } from '@/lib/mocks'
import { ScrollView } from 'react-native'

const TabsHome = () => {
  const [visible, setVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState<IInvoice | undefined>()

  const showModal = (row: IInvoice) => {
    setSelectedRow(row)
    setVisible(true)
  }

  const hideModal = () => {
    setVisible(false)
    setSelectedRow(undefined)
  }

  const handleConfirmVisit = () => {
    setVisible(false)
    setConfirmVisible(true)
  }

  const handleAction = async (action: 'generate' | 'cancel' | 'close') => {
    if (action === 'generate') {
      try {
        console.log('generate')
      } catch (error) {
        console.error('Erro durante a transação:', error)
      }
    } else if (action === 'cancel') {
      console.log('cancel')
    }
    setConfirmVisible(false)
    setSelectedRow(undefined)
  }

  return (
    <Surface style={styles.indexScreen}>
      <ScrollView showsHorizontalScrollIndicator={true}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Cliente</DataTable.Title>
            <DataTable.Title
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              Retorno
            </DataTable.Title>
          </DataTable.Header>
          {mockInvoices.map((row) => (
            <TouchableRipple key={row.id}>
              <DataTable.Row onPress={() => showModal(row)}>
                <DataTable.Cell>{row.costumer.name}</DataTable.Cell>
                <DataTable.Cell
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  {row.returnDate.toLocaleDateString('pt-BR')}
                </DataTable.Cell>
              </DataTable.Row>
            </TouchableRipple>
          ))}
        </DataTable>
      </ScrollView>
      <OrderModal
        visible={visible}
        onDismiss={hideModal}
        onConfirmVisit={handleConfirmVisit}
        data={selectedRow}
      />
      {confirmVisible && (
        <ConfirmVisitModal visible={confirmVisible} onAction={handleAction} />
      )}
    </Surface>
  )
}

export default TabsHome
