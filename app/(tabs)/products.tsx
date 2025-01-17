import { Card, Surface, Text, TouchableRipple } from 'react-native-paper'
import { useSQLiteContext } from 'expo-sqlite'
import { readProducts } from '@/lib/services/storage/productService'
import { FlatList, View } from 'react-native'
import { useEffect, useState } from 'react'
import { useProductContext } from '@/lib/context/ProductContext'
import { IProduct } from '@/lib/interfaces'
import { deleteProduct } from '@/lib/services/storage/productService'
import ConfirmRemoveProductModal from '@/lib/ui/components/ConfirmRemoveProductModal'

const Products = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const { products, setProducts, removeProduct } = useProductContext()
  const [selectedProduct, setSelectedProduct] = useState<IProduct>()
  const db = useSQLiteContext()

  const showModal = (product: IProduct) => {
    setSelectedProduct(product)
    setVisible(true)
  }

  const hideModal = () => {
    setVisible(false)
    setSelectedProduct(undefined)
  }

  const getProducts = async () => {
    try {
      const productsData = await readProducts(db)
      setProducts(productsData)
    } catch (error) {
      console.error(error)
    }
  }

  const handleRemove = async () => {
    if (!selectedProduct) return
    try {
      await deleteProduct(db, selectedProduct.id)
      removeProduct(selectedProduct.id)
      hideModal()
    } catch (error) {
      console.error('Erro ao remover o invoice:', error)
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
          <TouchableRipple onPress={() => showModal(item)}>
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
                  <Text
                    variant="bodySmall"
                    onPress={() => showModal}
                    style={{ color: 'red' }}
                  >
                    Remover
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableRipple>
        )}
      />
      <ConfirmRemoveProductModal
        visible={visible}
        onAction={handleRemove}
        onDismiss={hideModal}
      />
    </Surface>
  )
}

export default Products
