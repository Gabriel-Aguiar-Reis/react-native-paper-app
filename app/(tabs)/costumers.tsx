import { useCostumerContext } from '@/lib/context/CostumerContext'
import {
  deleteCostumer,
  readCostumers,
  updateCostumer as updateCostumerService
} from '@/lib/services/storage/costumerService'
import { useSQLiteContext } from 'expo-sqlite'
import { useEffect, useState } from 'react'
import { FlatList, Image } from 'react-native'
import { MaskedText } from 'react-native-mask-text'
import { Card, Surface, Text, TouchableRipple } from 'react-native-paper'
import { IReadCostumerData } from '@/lib/interfaces'
import EditCostumerModal from '@/lib/ui/components/EditCostumerModal'

const Costumers = () => {
  const { costumers, setCostumers, updateCostumer, removeCostumer } =
    useCostumerContext()
  const [selectedCostumer, setSelectedCostumer] = useState<IReadCostumerData>()
  const [visible, setVisible] = useState<boolean>(false)
  const db = useSQLiteContext()

  const getCostumers = async () => {
    try {
      const costumerData = await readCostumers(db)
      setCostumers(costumerData)
    } catch (error) {
      console.error(error)
    }
  }

  const showModal = (costumer: IReadCostumerData) => {
    setSelectedCostumer(costumer)
    setVisible(true)
  }

  const hideModal = () => {
    setVisible(false)
    setSelectedCostumer(undefined)
  }

  const handleUpdateCostumer = async (updatedData: IReadCostumerData) => {
    try {
      await updateCostumerService(updatedData, db)
      await updateCostumer(updatedData)
      hideModal()
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
    }
  }

  const handleRemove = async () => {
    if (!selectedCostumer) return
    try {
      await deleteCostumer(db, selectedCostumer.id)
      removeCostumer(selectedCostumer.id)
      hideModal()
    } catch (error) {
      console.error('Erro ao remover o invoice:', error)
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
          <TouchableRipple onPress={() => showModal(item)}>
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
                  {item.street}, {item.number} - {item.neighbourhood},{' '}
                  {item.city} -{' '}
                  <MaskedText mask={'99999-999'}>{item.zipCode}</MaskedText>
                </Text>
              </Card.Content>
            </Card>
          </TouchableRipple>
        )}
      />
      <EditCostumerModal
        visible={visible}
        onDismiss={hideModal}
        data={selectedCostumer}
        onConfirmRemove={handleRemove}
        onConfirmEdit={handleUpdateCostumer}
      />
    </Surface>
  )
}

export default Costumers
