import {
  IContact,
  ICostumer,
  ILocation,
  ICreateCostumerData,
  IReadCostumerData
} from '@/lib/interfaces'
import { styles } from '@/lib/ui/styles'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { MaskedTextInput } from 'react-native-mask-text'
import {
  Button,
  Card,
  Divider,
  Modal,
  Text,
  TextInput,
  RadioButton
} from 'react-native-paper'

const EditCostumerModal = ({
  visible,
  onDismiss,
  data,
  onConfirmRemove,
  onConfirmEdit
}: {
  visible: boolean
  onDismiss: () => void
  data?: IReadCostumerData
  onConfirmRemove: () => Promise<void>
  onConfirmEdit: (updateData: IReadCostumerData) => Promise<void>
}) => {
  const [name, setName] = useState<ICostumer['name']>('')
  const [street, setStreet] = useState<ILocation['street']>('')
  const [number, setNumber] = useState<ILocation['number']>(0)
  const [neigh, setNeigh] = useState<ILocation['neighbourhood']>('')
  const [city, setCity] = useState<ILocation['city']>('')
  const [zipCode, setZipCode] = useState<ILocation['zipCode']>('')
  const [contactName, setContactName] = useState<IContact['name']>('')
  const [phone, setPhone] = useState<IContact['phone']>('')
  const [isWhatsapp, setIsWhatsapp] = useState<IContact['isWhatsapp']>(0)

  const updatedData: ICreateCostumerData = {
    name,
    street,
    number,
    neighbourhood: neigh,
    city,
    zipCode,
    contactName,
    phone,
    isWhatsapp
  }

  const updatedDataWithIds: IReadCostumerData = {
    ...updatedData,
    id: data?.id || 0,
    locationId: data?.locationId || 0,
    contactId: data?.contactId || 0
  }

  useEffect(() => {
    if (data) {
      setName(data.name || '')
      setStreet(data.street || '')
      setNumber(data.number || 0)
      setNeigh(data.neighbourhood || '')
      setCity(data.city || '')
      setZipCode(data.zipCode || '')
      setContactName(data.contactName || '')
      setPhone(data.phone || '')
      setIsWhatsapp(data.isWhatsapp || 0)
    }
  }, [data])

  return (
    <Modal visible={visible} onDismiss={onDismiss}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <Card style={styles.modal}>
          <Card.Content>
            <TextInput
              key={1}
              value={name}
              label={'Nome da Empresa'}
              mode="outlined"
              onChangeText={(e) => setName(e)}
              multiline={true}
            />
            <Text variant="titleLarge" style={{ marginVertical: 10 }}>
              Dados de Endereço
            </Text>
            <Divider />
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 8 }}>
                <TextInput
                  key={2}
                  value={street}
                  label={'Rua'}
                  mode="outlined"
                  onChangeText={(e) => setStreet(e)}
                  multiline={true}
                />
              </View>
              <View style={{ flex: 2 }}>
                <TextInput
                  key={3}
                  value={String(number)}
                  label={'N.º'}
                  mode="outlined"
                  inputMode="tel"
                  onChangeText={(e) => setNumber(Number(e))}
                  multiline={true}
                />
              </View>
            </View>
            <TextInput
              key={4}
              value={neigh}
              label={'Bairro'}
              mode="outlined"
              onChangeText={(e) => setNeigh(e)}
              multiline={true}
            />
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 24 }}>
                <TextInput
                  key={5}
                  value={city}
                  label={'Cidade'}
                  mode="outlined"
                  onChangeText={(e) => setCity(e)}
                  multiline={true}
                />
              </View>
              <View style={{ flex: 16 }}>
                <TextInput
                  key={6}
                  value={zipCode}
                  label={'CEP'}
                  inputMode="tel"
                  mode="outlined"
                  render={(props) => (
                    <MaskedTextInput
                      {...props}
                      value={zipCode}
                      mask="99999-999"
                      onChangeText={(_, rawText) => {
                        props.onChangeText?.(rawText)
                        setZipCode(rawText)
                      }}
                    />
                  )}
                  multiline={true}
                />
              </View>
            </View>
            <Text variant="titleLarge" style={{ marginVertical: 10 }}>
              Dados de Contato
            </Text>
            <Divider />
            <TextInput
              key={7}
              value={contactName}
              label={'Nome de Contato'}
              mode="outlined"
              onChangeText={(e) => setContactName(e)}
              multiline={true}
            />
            <TextInput
              key={8}
              value={phone}
              label={'Telefone'}
              inputMode="tel"
              render={(props) => (
                <MaskedTextInput
                  {...props}
                  value={phone}
                  mask="(99) 99999-9999"
                  onChangeText={(_, rawText) => {
                    props.onChangeText?.(rawText)
                    setPhone(rawText)
                  }}
                />
              )}
              mode="outlined"
              multiline={true}
            />
            <Text>WhatsApp</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '20%'
                }}
              >
                <RadioButton
                  value="true"
                  status={isWhatsapp === 1 ? 'checked' : 'unchecked'}
                  onPress={() => setIsWhatsapp(1)}
                />
                <Text>Sim</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '20%'
                }}
              >
                <RadioButton
                  value="false"
                  status={isWhatsapp === 0 ? 'checked' : 'unchecked'}
                  onPress={() => setIsWhatsapp(0)}
                />
                <Text>Não</Text>
              </View>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button
              onPress={onConfirmRemove}
              mode="contained"
              style={{ alignSelf: 'center' }}
            >
              Remover
            </Button>
            <Button
              onPress={() => onConfirmEdit(updatedDataWithIds)}
              mode="outlined"
              style={{ alignSelf: 'center' }}
            >
              Editar
            </Button>
            <Button
              onPress={onDismiss}
              mode="contained-tonal"
              style={{ alignSelf: 'center' }}
            >
              Fechar
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </Modal>
  )
}
export default EditCostumerModal
