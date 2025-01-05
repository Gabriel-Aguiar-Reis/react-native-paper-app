import { useCostumerContext } from '@/lib/context/CostumerContext'
import { ICostumer, ICreateCostumerData } from '@/lib/interfaces'
import { createCostumer } from '@/lib/services/storage/costumerService'
import { styles } from '@/lib/ui'
import { router } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useState } from 'react'
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
  const [locationStreet, setLocationStreet] =
    useState<ICostumer['locationData']['street']>('')
  const [locationNumber, setLocationNumber] =
    useState<ICostumer['locationData']['number']>(0)
  const [locationNeigh, setLocationNeigh] =
    useState<ICostumer['locationData']['neighbourhood']>('')
  const [locationCity, setLocationCity] =
    useState<ICostumer['locationData']['city']>('')
  const [locationCEP, setLocationCEP] =
    useState<ICostumer['locationData']['CEP']>('')
  const [contactName, setContactName] =
    useState<ICostumer['contactData']['name']>('')
  const [contactNumber, setContactNumber] =
    useState<ICostumer['contactData']['phone']>('')
  const [isWhatsapp, setIsWhatsapp] =
    useState<ICostumer['contactData']['isWhatsapp']>(false)

  const db = useSQLiteContext()

  const { addCostumer } = useCostumerContext()

  const data: ICreateCostumerData = {
    name: name,
    locationData: {
      street: locationStreet,
      number: locationNumber,
      neighbourhood: locationNeigh,
      city: locationCity,
      CEP: locationCEP
    },
    contactData: {
      name: contactName,
      phone: contactNumber,
      isWhatsapp: isWhatsapp
    }
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
              onChangeText={(e) => setLocationStreet(e)}
              multiline={true}
            />
          </View>
          <View style={{ flex: 2 }}>
            <TextInput
              key={3}
              label={'N.º'}
              mode="outlined"
              inputMode="numeric"
              onChangeText={(e) => setLocationNumber(Number(e))}
              multiline={true}
            />
          </View>
        </View>
        <TextInput
          key={4}
          label={'Bairro'}
          mode="outlined"
          onChangeText={(e) => setLocationNeigh(e)}
          multiline={true}
        />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 27 }}>
            <TextInput
              key={5}
              label={'Cidade'}
              mode="outlined"
              onChangeText={(e) => setLocationCity(e)}
              multiline={true}
            />
          </View>
          <View style={{ flex: 13 }}>
            <TextInput
              key={6}
              label={'CEP'}
              inputMode="numeric"
              mode="outlined"
              render={(props) => (
                <MaskedTextInput
                  {...props}
                  value={locationCEP}
                  mask="99999-999"
                  onChangeText={(_, rawText) => {
                    props.onChangeText?.(rawText)
                    setLocationCEP(rawText)
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
              value={contactNumber}
              mask="(99) 99999-9999"
              onChangeText={(_, rawText) => {
                props.onChangeText?.(rawText)
                setContactNumber(rawText)
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
              status={isWhatsapp === true ? 'checked' : 'unchecked'}
              onPress={() => setIsWhatsapp(true)}
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
              status={isWhatsapp === false ? 'checked' : 'unchecked'}
              onPress={() => setIsWhatsapp(false)}
            />
            <Text>Não</Text>
          </View>
        </View>

        <Button
          onPress={handleCreate}
          mode="contained"
          style={{ width: '40%', alignSelf: 'center' }}
        >
          Criar
        </Button>
      </ScrollView>
    </Surface>
  )
}

export default CreateCostumer
