import { Card, Surface, Text } from 'react-native-paper'
import { useSQLiteContext } from 'expo-sqlite'
import { readProducts } from '@/lib/services/storage/productsService'
import { FlatList, View } from 'react-native'
import { IProduct } from '@/lib/interfaces'
import { useEffect, useState } from 'react'

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([])
  const db = useSQLiteContext()

  const getProducts = async () => {
    try {
      const productsData = await readProducts(db)
      setProducts(productsData)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getProducts()
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
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card mode="outlined" style={{ marginBottom: 12 }}>
            <Card.Content>
              <Text variant="headlineSmall">
                {item.name} - {item.categoryName}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text variant="bodySmall" style={{ color: 'gray' }}>
                  Validade: {item.validityMonths} meses
                </Text>
                <Text variant="bodySmall" style={{ color: 'gray' }}>
                  Preço: R$ {String(item.price).replace('.', ',')}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </Surface>
  )
}

export default Products
