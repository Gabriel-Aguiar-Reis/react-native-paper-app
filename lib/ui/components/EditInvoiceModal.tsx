import { useInvoiceContext } from '@/lib/context/InvoiceContext'
import {
  IInvoice,
  IInvoiceProduct,
  IProduct,
  IReadInvoiceData,
  IReadInvoiceProductData
} from '@/lib/interfaces'
import {
  createInvoiceProduct,
  deleteInvoiceProduct,
  updateInvoiceProduct
} from '@/lib/services/storage/invoiceProductService'
import {
  updateInvoicePayment,
  updateInvoiceTotalValue
} from '@/lib/services/storage/invoiceService'
import { readProducts } from '@/lib/services/storage/productService'
import { styles } from '@/lib/ui/styles'
import { useSQLiteContext } from 'expo-sqlite'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import {
  Button,
  Card,
  Divider,
  IconButton,
  Modal,
  Text,
  TextInput
} from 'react-native-paper'
import { PaperSelect } from 'react-native-paper-select'
import { ListItem } from 'react-native-paper-select/lib/typescript/interface/paperSelect.interface'
import { setStoredInvoices } from '@/lib/services/storage/storedInvoiceService'

const EditInvoiceModal = ({
  visible,
  onDismiss,
  onEdit,
  invoice
}: {
  visible: boolean
  onDismiss: () => void
  onEdit: () => void
  invoice: IReadInvoiceData
}) => {
  const db = useSQLiteContext()

  const [paymentMethod, setPaymentMethod] = useState<IInvoice['paymentMethod']>(
    invoice.paymentMethod
  )
  const [deadline, setDeadline] = useState<IInvoice['deadline']>(
    invoice.deadline
  )
  const [products, setProducts] = useState<IProduct[]>([])
  const [productId, setProductId] = useState<IProduct['id']>(0)
  const [selectedProducts, setSelectedProducts] = useState<
    IReadInvoiceProductData[]
  >([...invoice.products])
  const [totalValue, setTotalValue] = useState<IInvoice['totalValue']>(0)
  const [quantity, setQuantity] = useState<IInvoiceProduct['quantity']>(0)

  const [productList, setProductList] = useState<{
    value: string
    list: ListItem[]
    selectedList: ListItem[]
    error: string
  }>({
    value: '',
    list: [],
    selectedList: [],
    error: ''
  })

  const { setInvoices, invoices, indexInvoices, setIndexInvoices } =
    useInvoiceContext()

  const getProducts = async () => {
    try {
      const productsData = await readProducts(db)
      setProducts(productsData)

      const formattedProductList = productsData.map((p) => ({
        _id: String(p.id),
        value: `${p.name} - ${p.price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })}`
      }))

      setProductList((prev) => ({
        ...prev,
        list: formattedProductList
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const calculateTotalValue = () => {
    const total = selectedProducts.reduce((acc, product) => {
      return acc + product.quantity * product.price
    }, 0)
    setTotalValue(total)
  }

  const handleAddProduct = async () => {
    if (productId === 0 || quantity === 0) return

    try {
      const productData = products.find((product) => product.id === productId)
      if (!productData) return

      const existingProduct = selectedProducts.find(
        (product) => product.productId === productId
      )

      if (existingProduct) {
        await updateInvoiceProduct({
          db,
          id: existingProduct.id,
          quantity: existingProduct.quantity + quantity
        })
      } else {
        await createInvoiceProduct({
          db,
          data: {
            invoiceId: invoice.id,
            productId,
            quantity
          }
        })
      }

      await fetchInvoiceProducts()
      calculateTotalValue()
    } catch (error) {
      console.error('Erro ao adicionar produto:', error)
    }
  }

  const handleRemoveProduct = async (id: number) => {
    try {
      await deleteInvoiceProduct({ db, id })
      await fetchInvoiceProducts()
      calculateTotalValue()
    } catch (error) {
      console.error('Erro ao remover produto:', error)
    }
  }

  const handleEditInvoice = async () => {
    try {
      for (const product of selectedProducts) {
        await updateInvoiceProduct({
          db,
          id: product.id,
          quantity: product.quantity
        })
      }
      if (invoice.paid === null) {
        await updateInvoicePayment({
          db,
          invoice: {
            ...invoice,
            paymentMethod,
            deadline,
            paid: 0 as const
          }
        })
      } else {
        await updateInvoicePayment({
          db,
          invoice: {
            ...invoice,
            paymentMethod,
            deadline
          }
        })
      }

      await updateInvoiceTotalValue({
        db,
        id: invoice.id,
        totalValue
      })

      await fetchInvoiceProducts()

      const updatedInvoices = invoices.map((inv) =>
        inv.id === invoice.id
          ? {
              ...inv,
              products: selectedProducts,
              paymentMethod,
              deadline,
              totalValue,
              paid: 0 as const
            }
          : inv
      )
      setInvoices(updatedInvoices)

      const updatedIndexInvoices = indexInvoices.map((inv) =>
        inv.id === invoice.id
          ? {
              ...inv,
              products: selectedProducts,
              paymentMethod,
              deadline,
              totalValue,
              paid: 0 as const
            }
          : inv
      )
      setIndexInvoices(updatedIndexInvoices)
      await setStoredInvoices(db, updatedIndexInvoices)

      onEdit()
    } catch (error) {
      console.error('Erro ao editar fatura:', error)
    }
  }

  const fetchInvoiceProducts = async () => {
    try {
      const updatedProducts = (await db.getAllAsync(
        `
        SELECT 
          i.id,
          i.productId,
          i.quantity,
          p.name,
          p.price,
          p.validityMonths,
          p.categoryName
        FROM invoice_products i
        INNER JOIN products p ON i.productId = p.id
        WHERE i.invoiceId = ?;
        `,
        [invoice.id]
      )) as IReadInvoiceProductData[]

      setSelectedProducts(updatedProducts)
    } catch (error) {
      console.error('Erro ao buscar produtos da fatura:', error)
    }
  }

  const handleIncreaseQuantity = async (id: number) => {
    try {
      const product = selectedProducts.find((p) => p.id === id)
      if (!product) return

      await updateInvoiceProduct({
        db,
        id: product.id,
        quantity: product.quantity + 1
      })

      await fetchInvoiceProducts()
      calculateTotalValue()
    } catch (error) {
      console.error('Erro ao aumentar quantidade:', error)
    }
  }

  const handleDecreaseQuantity = async (id: number) => {
    try {
      const product = selectedProducts.find((p) => p.id === id)
      if (!product || product.quantity <= 1) return // Garante que não diminua abaixo de 1

      await updateInvoiceProduct({
        db,
        id: product.id,
        quantity: product.quantity - 1
      })

      await fetchInvoiceProducts()
      calculateTotalValue()
    } catch (error) {
      console.error('Erro ao diminuir quantidade:', error)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  useEffect(() => {
    calculateTotalValue()
  }, [selectedProducts])

  useEffect(() => {
    if (visible) {
      fetchInvoiceProducts()
    }
  }, [visible])

  return (
    <Modal visible={visible} onDismiss={onDismiss}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <Card style={styles.modal}>
          <Card.Title title="Editar" titleVariant="titleLarge" />
          <Card.Content>
            <TextInput
              key={1}
              value={paymentMethod}
              label={'Método de Pagamento'}
              mode="outlined"
              onChangeText={(e) => setPaymentMethod(e)}
              multiline={true}
            />
            <TextInput
              key={2}
              value={deadline}
              label={'Prazo'}
              mode="outlined"
              onChangeText={(e) => setDeadline(e)}
              multiline={true}
              inputMode="tel"
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <View
                style={{
                  flex: 3,
                  marginTop: 5
                }}
              >
                <PaperSelect
                  label="Selecione Produto"
                  value={productList.value}
                  onSelection={(value: any) => {
                    setProductList({
                      ...productList,
                      value: value.text,
                      selectedList: value.selectedList,
                      error: ''
                    })

                    const selected = products.find(
                      (p) => String(p.id) === value.selectedList[0]?._id
                    )
                    setProductId(selected?.id ?? 0)
                  }}
                  arrayList={[...productList.list]}
                  selectedArrayList={productList.selectedList}
                  errorText={productList.error}
                  multiEnable={false}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  height: 56,
                  alignItems: 'flex-end'
                }}
              >
                <TextInput
                  key={3}
                  label={'Qte.'}
                  mode="outlined"
                  onChangeText={(e) => setQuantity(Number(e))}
                  inputMode="tel"
                  multiline={true}
                />
              </View>
            </View>
            <Button
              mode="contained"
              style={{ alignSelf: 'center', width: 180, marginTop: 10 }}
              compact={true}
              disabled={quantity === 0 || productId === undefined}
              onPress={handleAddProduct}
            >
              Adicionar à listagem
            </Button>
            <Text variant="titleLarge" style={{ marginTop: 10 }}>
              Listagem de itens
            </Text>
            <Divider />
            <Card mode="outlined" style={{ borderRadius: 5, marginTop: 5 }}>
              <Card.Content>
                <ScrollView showsVerticalScrollIndicator={true}>
                  {selectedProducts.map((product) => (
                    <View
                      key={product.id}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 5
                      }}
                    >
                      <Text>
                        {product.name} -{' '}
                        {product.price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </Text>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <IconButton
                          icon="minus"
                          onPress={() => handleDecreaseQuantity(product.id)}
                          disabled={product.quantity === 1}
                        />
                        <Text>{product.quantity}</Text>
                        <IconButton
                          icon="plus"
                          onPress={() => handleIncreaseQuantity(product.id)}
                        />
                        <IconButton
                          icon="delete"
                          onPress={() => handleRemoveProduct(product.id)}
                        />
                      </View>
                    </View>
                  ))}
                  <Divider />
                  <Text style={{ marginTop: 5, textAlign: 'right' }}>
                    Valor Total:{' '}
                    {totalValue.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </Text>
                </ScrollView>
              </Card.Content>
            </Card>
          </Card.Content>
          <Card.Actions>
            <Button
              onPress={handleEditInvoice}
              mode="contained"
              style={{ alignSelf: 'center' }}
            >
              Confirmar
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
export default EditInvoiceModal
