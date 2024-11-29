import React from 'react'
import { Modal, Text, Button, Card } from 'react-native-paper'
import { styles } from '@/lib/ui/styles'
import { IOrderRow } from '@/lib/interfaces'

const OrderModal = ({
  visible,
  onDismiss,
  data
}: {
  visible: boolean
  onDismiss: () => void
  data: IOrderRow | null
}) => {
  return (
    <Modal visible={visible} onDismiss={onDismiss}>
      <Card style={styles.orderModal}>
        <Text style={{ marginBottom: 10 }}>
          {data ? `Cliente: ${data.name}` : ''}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          {data ? `Endereço: ${data.street}` : ''}
        </Text>
        <Text style={{ marginBottom: 10 }}>
          {data ? `Retorno: ${data.returnDate}` : ''}
        </Text>
        <Button onPress={onDismiss}>Fechar</Button>
      </Card>
    </Modal>
  )
}

export default OrderModal
