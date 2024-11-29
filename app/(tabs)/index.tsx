import React, { useState } from 'react'
import { DataTable, Surface, Text } from 'react-native-paper'
import { OrderModal, styles } from '@/lib/ui'
import { IOrderRow } from '@/lib/interfaces'

const TabsHome = () => {
  const [visible, setVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState<IOrderRow | null>(null)

  const showModal = (row: IOrderRow) => {
    setSelectedRow(row)
    setVisible(true)
  }

  const hideModal = () => {
    setVisible(false)
    setSelectedRow(null)
  }

  const data = [
    { key: 1, name: 'Doceria Joao', street: 'Rua 1', returnDate: '11/08/2024' },
    {
      key: 2,
      name: 'Lanchonete Xis',
      street: 'Rua 2',
      returnDate: '14/09/2024'
    },
    { key: 3, name: 'Igreja Vida', street: 'Rua 3', returnDate: '15/10/2024' },
    {
      key: 4,
      name: 'Carlos Drummond',
      street: 'Rua 4',
      returnDate: '11/08/2024'
    },
    {
      key: 5,
      name: 'Papelaria Dois',
      street: 'Rua 2',
      returnDate: '20/07/2024'
    },
    { key: 6, name: 'Fabrica Giga', street: 'Rua 1', returnDate: '11/01/2025' }
  ]

  return (
    <Surface style={styles.screen}>
      <Text variant="displaySmall">Roteiro Atual</Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Cliente</DataTable.Title>
          <DataTable.Title>Endereço</DataTable.Title>
          <DataTable.Title>Retorno</DataTable.Title>
        </DataTable.Header>
        {data.map((row) => (
          <DataTable.Row key={row.key} onPress={() => showModal(row)}>
            <DataTable.Cell>{row.name}</DataTable.Cell>
            <DataTable.Cell>{row.street}</DataTable.Cell>
            <DataTable.Cell>{row.returnDate}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
      <OrderModal visible={visible} onDismiss={hideModal} data={selectedRow} />
    </Surface>
  )
}

export default TabsHome
