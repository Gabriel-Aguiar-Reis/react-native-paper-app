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
        style={{
          width: '90%',
          alignSelf: 'center',
          padding: 8,
          height: '100%'
        }}
        data={costumers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card mode="outlined" style={{ marginBottom: 12 }}>
            <Card.Content>
              <Text variant="headlineSmall">{item.name}</Text>
              <Text variant="bodyLarge" numberOfLines={2}>
                {item.contactName} -{' '}
                <MaskedText mask="(99) 99999-9999">{item.phone}</MaskedText>{' '}
                {item.isWhatsapp === 1 && (
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
                {item.street}, {item.number} - {item.neighbourhood}, {item.city}{' '}
                - <MaskedText mask={'99999-999'}>{item.zipCode}</MaskedText>
              </Text>
            </Card.Content>
          </Card>
        )}
      />
    </Surface>
  )
}

export default Costumers
