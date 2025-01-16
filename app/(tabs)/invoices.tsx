import { Card, Surface, Text } from 'react-native-paper'
import { useSQLiteContext } from 'expo-sqlite'
import { readInvoices } from '@/lib/services/storage/invoiceService'
import { FlatList, View } from 'react-native'
import { IReadInvoiceData } from '@/lib/interfaces'
import { useEffect, useState } from 'react'
import { readCostumers } from '@/lib/services/storage/costumerService'

const Invoices = () => {
  const [invoices, setInvoices] = useState<IReadInvoiceData[]>([])
  const db = useSQLiteContext()

  const getInvoices = async () => {
    try {
      const invoicesData = await readInvoices(db)
      console.log(invoicesData)
      const costumersData = await readCostumers(db)
      invoicesData.map((invoice) => {
        costumersData.forEach((costumer) => {
          if (costumer.id === invoice.costumerId) {
            return {
              ...invoice,
              costumerName: costumer.name,
              contactName: costumer.contactName,
              contactPhone: costumer.phone
            }
          }
        })
      })
      setInvoices(invoicesData)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getInvoices()
  }, [])

  return (
    <Surface>
      <FlatList
        style={{ width: '90%', alignSelf: 'center', padding: 8 }}
        data={invoices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card mode="outlined" style={{ marginBottom: 12 }}>
            <Card.Content>
              <Text variant="headlineSmall">
                {item.name} - {item.returnDate}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text variant="bodySmall" style={{ color: 'gray' }}>
                  Contato: {item.contactName} - Visita: {item.visitDate}
                </Text>
              </View>
              <Text variant="bodySmall">
                Valor Total:{' '}
                {item.totalValue.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </Text>
            </Card.Content>
          </Card>
        )}
      />
    </Surface>
  )
}

export default Invoices
