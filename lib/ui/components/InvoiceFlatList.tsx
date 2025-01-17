import { IReadInvoiceData } from '@/lib/interfaces'
import { FlatList, View } from 'react-native'
import { Card, Text, TouchableRipple } from 'react-native-paper'

const InvoiceFlatList = ({
  invoices,
  onPressItem
}: {
  invoices: IReadInvoiceData[]
  onPressItem: (invoice: IReadInvoiceData) => void
}) => {
  const getRealizedText = (realized: number | undefined): string => {
    switch (realized) {
      case 0:
        return 'Troca Pendente'
      case 1:
        return 'Troca Realizada'
      case 2:
        return 'Troca Cancelada'
      default:
        return 'Status Desconhecido'
    }
  }
  return (
    <FlatList
      style={{ width: '90%', alignSelf: 'center', padding: 8, height: '100%' }}
      data={invoices}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableRipple onPress={() => onPressItem(item)}>
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text variant="bodySmall">
                  Valor Total:{' '}
                  {item.totalValue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </Text>
                <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  {getRealizedText(item.realized)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableRipple>
      )}
    />
  )
}
export default InvoiceFlatList
