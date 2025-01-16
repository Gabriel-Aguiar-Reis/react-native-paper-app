import { useCostumerContext } from '@/lib/context/CostumerContext'
import {
  IContact,
  ICostumer,
  ICreateCostumerData,
  ILocation
} from '@/lib/interfaces'
import { createCostumer } from '@/lib/services/storage/costumerService'
import { styles } from '@/lib/ui'
import { router } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { MaskedTextInput } from 'react-native-mask-text'
import {
  Button,
  Divider,
  RadioButton,
  Surface,
  Text,
  TextInput
} from 'react-native-paper'

const CreateCostumer = () => {
  const [name, setName] = useState<ICostumer['name']>('')
  const [street, setStreet] = useState<ILocation['street']>('')
  const [houseNumber, setHouseNumber] = useState<ILocation['number']>(0)
  const [neigh, setNeigh] = useState<ILocation['neighbourhood']>('')
  const [city, setCity] = useState<ILocation['city']>('')
  const [zipCode, setZipCode] = useState<ILocation['zipCode']>('')
  const [contactName, setContactName] = useState<IContact['name']>('')
  const [phone, setPhone] = useState<IContact['phone']>('')
  const [isWhatsapp, setIsWhatsapp] = useState<IContact['isWhatsapp']>(0)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const db = useSQLiteContext()

  const { addCostumer } = useCostumerContext()

  const data: ICreateCostumerData = {
    name,
    street,
    number: houseNumber,
    neighbourhood: neigh,
    city,
    zipCode,
    contactName,
    phone,
    isWhatsapp: isWhatsapp
  }

  const handleCreate = async () => {
    try {
      const result = await createCostumer(data, db)
      addCostumer(result)
      router.push('/costumers')
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const isFormValid =
      name.trim() !== '' &&
      street.trim() !== '' &&
      houseNumber > 0 &&
      neigh.trim() !== '' &&
      city.trim() !== '' &&
      zipCode.trim().length === 8 && // Ex.: "99999-999"
      contactName.trim() !== '' &&
      phone.trim().length === 11 // Ex.: "(99) 99999-9999"

    setIsButtonDisabled(!isFormValid)
  }, [name, street, houseNumber, neigh, city, zipCode, contactName, phone])

  return (
    <Surface style={styles.indexScreen}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <TextInput
          key={1}
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
              label={'Rua'}
              mode="outlined"
              onChangeText={(e) => setStreet(e)}
              multiline={true}
            />
          </View>
          <View style={{ flex: 2 }}>
            <TextInput
              key={3}
              label={'N.º'}
              mode="outlined"
              inputMode="tel"
              onChangeText={(e) => setHouseNumber(Number(e))}
              multiline={true}
            />
          </View>
        </View>
        <TextInput
          key={4}
          label={'Bairro'}
          mode="outlined"
          onChangeText={(e) => setNeigh(e)}
          multiline={true}
        />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 27 }}>
            <TextInput
              key={5}
              label={'Cidade'}
              mode="outlined"
              onChangeText={(e) => setCity(e)}
              multiline={true}
            />
          </View>
          <View style={{ flex: 13 }}>
            <TextInput
              key={6}
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
          label={'Nome de Contato'}
          mode="outlined"
          onChangeText={(e) => setContactName(e)}
          multiline={true}
        />
        <TextInput
          key={8}
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

        <Button
          onPress={handleCreate}
          mode="contained"
          style={{ width: '40%', alignSelf: 'center' }}
          disabled={isButtonDisabled}
        >
          Criar
        </Button>
      </ScrollView>
    </Surface>
  )
}

export default CreateCostumer
