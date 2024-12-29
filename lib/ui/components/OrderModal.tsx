import { IInvoice } from '@/lib/interfaces'
import { styles } from '@/lib/ui/styles'
import React from 'react'
import { ScrollView, View } from 'react-native'
import {
  Button,
  Card,
  Divider,
  Modal,
  Text,
  TextInput
} from 'react-native-paper'

const OrderModal = ({
  visible,
  onDismiss,
  onConfirmVisit,
  data
}: {
  visible: boolean
  onDismiss: () => void
  onConfirmVisit: () => void
  data?: IInvoice
}) => {
  const TextInputData = {
    mode: 'outlined' as const,
    multiline: true,
    editable: false
  }
  const HeaderData = [
    { key: '1H', label: 'Nome', value: data?.costumer.name },
    {
      key: '2H',
      label: 'Contato',
      value: `${data?.costumer.contactData.name} - ${data?.costumer.contactData.phone}`
    },
    {
      key: '3H',
      label: 'Endereço',
      value: `${data?.costumer.locationData.street} ${data?.costumer.locationData.number}, ${data?.costumer.locationData.neighbourhood} - ${data?.costumer.locationData.CEP} - ${data?.costumer.locationData.city}`
    }
  ]

  const BodyData = [
    {
      key: '1B',
      label: 'Data da Visita',
      value: `${data?.visitDate.toLocaleDateString('pt-BR')}`
    },
    {
      key: '2B',
      label: 'Data do Retorno',
      value: `${data?.returnDate.toLocaleDateString('pt-BR')}`
    }
  ]
  return (
    <Modal visible={visible} onDismiss={onDismiss}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <Card style={styles.orderModal}>
          <Card.Title title="Dados do Cliente" titleVariant="titleLarge" />
          <Card.Content style={{ marginBottom: 8 }}>
            {HeaderData.map((header) => (
              <TextInput
                key={header.key}
                mode={TextInputData.mode}
                editable={TextInputData.editable}
                label={header.label}
                value={header.value}
                multiline={TextInputData.multiline}
              />
            ))}
          </Card.Content>
          <Divider />
          <Card.Title title="Dados da Visita" titleVariant="titleLarge" />
          <Card.Content>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                maxWidth: '99%',
                justifyContent: 'space-between'
              }}
            >
              {BodyData.map((body) => (
                <TextInput
                  key={body.key}
                  mode={TextInputData.mode}
                  editable={TextInputData.editable}
                  label={body.label}
                  value={body.value}
                  multiline={TextInputData.multiline}
                />
              ))}
            </View>
            <Card
              mode="outlined"
              style={{
                marginTop: 5,
                borderRadius: 5
              }}
            >
              <Card.Content>
                <Text variant="labelLarge" style={{ marginBottom: 8 }}>
                  Lista de Itens
                </Text>
                <Divider />
                {data?.products.map((prod) => (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      maxWidth: '99%',
                      justifyContent: 'space-between',
                      marginBottom: 5,
                      marginLeft: 5
                    }}
                  >
                    <View>
                      <Text
                        key={prod.product.id}
                        variant="bodyMedium"
                        style={{ width: 190 }}
                      >
                        {prod.product.name}
                      </Text>
                      <Text variant="bodySmall" style={{ marginLeft: 10 }}>
                        Validade: {prod.product.validityMonths} meses
                      </Text>
                    </View>
                    <Text key={`${prod.product.id}qty`} variant="bodyMedium">
                      {`${prod.quantity} x ${prod.product.price.toLocaleString(
                        'pt-br',
                        {
                          style: 'currency',
                          currency: 'BRL'
                        }
                      )}`}
                    </Text>
                  </View>
                ))}
                <Divider />
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    maxWidth: '99%',
                    justifyContent: 'space-between'
                  }}
                >
                  <Text>Valor Total:</Text>
                  <Text>
                    {data?.totalValue.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </Card.Content>
          <Card.Actions
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Button mode="contained" onPress={onConfirmVisit}>
              Confirmar Visita
            </Button>
            <Button mode="contained-tonal" onPress={onDismiss}>
              Fechar
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </Modal>
  )
}

export default OrderModal
