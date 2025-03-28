import { IReadInvoiceData } from '@/lib/interfaces'
import { styles } from '@/lib/ui/styles'
import React from 'react'
import { ScrollView, View, Image } from 'react-native'
import { mask } from 'react-native-mask-text'
import {
  Button,
  Card,
  Divider,
  Modal,
  Text,
  TextInput
} from 'react-native-paper'

const InvoiceModal = ({
  visible,
  onDismiss,
  onOpenEdit,
  onConfirmVisit,
  onConfirmRemove,
  onConfirmPayment,
  handleMessage,
  data,
  isRemovable
}: {
  visible: boolean
  onDismiss: () => void
  onOpenEdit?: () => void
  onConfirmVisit?: () => void
  onConfirmRemove?: () => void
  onConfirmPayment?: () => Promise<void>
  handleMessage?: () => void
  data?: IReadInvoiceData
  isRemovable?: boolean
}) => {
  const TextInputData = {
    mode: 'outlined' as const,
    multiline: true,
    editable: false
  }

  const formattedPhone = data?.phone ? mask(data.phone, '(99) 99999-9999') : ''
  const formattedZipCode = data?.zipCode ? mask(data.zipCode, '99999-999') : ''
  const formattedDeadline = data?.deadline
    ? mask(data.deadline, '99/99/9999')
    : ''

  const HeaderData = [
    { key: '1H', label: 'Nome', value: data?.name },
    {
      key: '2H',
      label: 'Contato',
      value: `${data?.contactName} - ${formattedPhone}`
    },
    {
      key: '3H',
      label: 'Endereço',
      value: `${data?.street} ${data?.number}, ${data?.neighbourhood}, ${data?.city} - ${formattedZipCode}`
    },
    {
      key: '4H',
      label: 'Método de Pgto. e Prazo',
      value:
        data?.deadline === ''
          ? `${data?.paymentMethod}`
          : `${data?.paymentMethod} - Prazo: ${data?.deadline}`
    }
  ]

  const BodyData = [
    {
      key: '1B',
      label: 'Data da Visita',
      value: `${data?.visitDate}`
    },
    {
      key: '2B',
      label: 'Data do Retorno',
      value: `${data?.returnDate}`
    }
  ]
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
      >
        <Card style={styles.modal}>
          <Card.Title title="Dados do Cliente" titleVariant="titleLarge" />
          <View
            style={{
              marginLeft: 15,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {data?.paid === 1 &&
              data?.paymentMethod &&
              data?.paymentMethod !== '' && <Text>Pagamento realizado</Text>}
            {data?.paid === 0 &&
              data?.paymentMethod &&
              data?.paymentMethod !== '' && (
                <Text style={{ color: 'red' }}>
                  Pagamento não foi realizado
                </Text>
              )}
            {data?.isWhatsapp === 1 && handleMessage && (
              <Button mode="outlined" onPress={handleMessage}>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row'
                  }}
                >
                  <Image
                    source={require('@/assets/images/whatsapp-icon.png')}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                </View>
              </Button>
            )}
          </View>
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
                        key={prod.productId}
                        variant="bodyMedium"
                        style={{ width: 190 }}
                      >
                        {prod.name}
                      </Text>
                      <Text variant="bodySmall" style={{ marginLeft: 10 }}>
                        Validade: {prod.validityMonths} meses
                      </Text>
                    </View>
                    <Text key={`${prod.id}qty`} variant="bodyMedium">
                      {`${prod.quantity} x ${prod.price.toLocaleString(
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
            {isRemovable ? (
              <Button mode="contained" onPress={onConfirmRemove}>
                Remover
              </Button>
            ) : (
              <Button
                mode="contained"
                disabled={data?.realized === 1 || data?.realized === 2}
                onPress={onConfirmVisit}
              >
                Visita
              </Button>
            )}
            {isRemovable ? (
              <></>
            ) : (
              <Button
                mode="outlined"
                disabled={data?.paid === 1}
                onPress={onConfirmPayment}
              >
                Pgto.
              </Button>
            )}
            <Button
              mode="contained-tonal"
              onPress={onOpenEdit}
              disabled={data?.realized === 1 || data?.realized === 2}
            >
              Editar
            </Button>
            <Button mode="contained-tonal" onPress={onDismiss}>
              Sair
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </Modal>
  )
}

export default InvoiceModal
