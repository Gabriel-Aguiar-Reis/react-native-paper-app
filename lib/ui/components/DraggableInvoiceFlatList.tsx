import { IReadInvoiceData } from '@/lib/interfaces'
import { View } from 'react-native'
import { Card, Text, TouchableRipple } from 'react-native-paper'
import DraggableFlatList from 'react-native-draggable-flatlist'

const DraggableInvoiceFlatList = ({
  invoices,
  onPressItem,
  onReorder
}: {
  invoices: IReadInvoiceData[]
  onPressItem: (invoice: IReadInvoiceData) => void
  onReorder: (data: IReadInvoiceData[]) => Promise<void>
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
    <DraggableFlatList
      style={{ width: '90%', alignSelf: 'center', padding: 8, height: '100%' }}
      data={invoices}
      renderItem={({ item, drag }) => (
        <TouchableRipple onPress={() => onPressItem(item)} onLongPress={drag}>
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
                <View>
                  <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    {getRealizedText(item.realized)}
                  </Text>
                  {item.paid === 0 ? (
                    <Text
                      style={{
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: 'red'
                      }}
                    >
                      Pagamento não foi realizado
                    </Text>
                  ) : (
                    <Text
                      style={{
                        textAlign: 'right',
                        fontWeight: 'bold'
                      }}
                    >
                      Pagamento realizado
                    </Text>
                  )}
                </View>
              </View>
            </Card.Content>
          </Card>
        </TouchableRipple>
      )}
      keyExtractor={(item) => `${item.id}`}
      onDragEnd={({ data }) => onReorder(data)}
    />
  )
}

export default DraggableInvoiceFlatList
