import { useCostumerContext } from '@/lib/context/CostumerContext'
import { readCostumers } from '@/lib/services/storage/costumerService'
import { useSQLiteContext } from 'expo-sqlite'
import { useEffect } from 'react'
import { FlatList, Image } from 'react-native'
import { MaskedText } from 'react-native-mask-text'
import { Card, Surface, Text } from 'react-native-paper'

const Costumers = () => {
  const { costumers, setCostumers } = useCostumerContext()
  const db = useSQLiteContext()

  const getCostumers = async () => {
    try {
      const costumerData = await readCostumers(db)
      setCostumers(costumerData)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getCostumers()
  }, [])

  return (
    <Surface>
      <FlatList
        style={{ width: '90%', alignSelf: 'center', padding: 8 }}
        data={costumers}
        keyExtractor={(item) => item.cosId.toString()}
        renderItem={({ item }) => (
          <Card mode="outlined" style={{ marginBottom: 12 }}>
            <Card.Content>
              <Text variant="headlineSmall">{item.cosName}</Text>
              <Text variant="bodyLarge" numberOfLines={2}>
                {item.contactData.conName} -{' '}
                <MaskedText mask="(99) 99999-9999">
                  {item.contactData.phone}
                </MaskedText>{' '}
                {item.contactData.isWhatsapp === 1 && (
                  <Image
                    source={require('@/assets/images/whatsapp-icon.png')}
                    style={{ width: 14, height: 14, marginLeft: 8 }}
                    resizeMode="contain"
                  />
                )}
              </Text>
              <Text
                variant="bodySmall"
                numberOfLines={3}
                style={{ color: 'gray' }}
              >
                {item.locationData.street}, {item.locationData.number} -{' '}
                {item.locationData.neighbourhood}, {item.locationData.city} -{' '}
                <MaskedText mask={'99999-999'}>
                  {item.locationData.CEP}
                </MaskedText>
              </Text>
            </Card.Content>
          </Card>
        )}
      />
    </Surface>
  )
}

export default Costumers
