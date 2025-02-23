import { useCostumerContext } from '@/lib/context/CostumerContext'
import { useInvoiceContext } from '@/lib/context/InvoiceContext'
import {
  ICreateInvoiceData,
  IInvoice,
  IInvoiceProduct,
  IProduct,
  IReadCostumerData,
  IReadInvoiceData,
  IReadInvoiceProductData
} from '@/lib/interfaces'
import { readCostumers } from '@/lib/services/storage/costumerService'

import { createInvoice } from '@/lib/services/storage/invoiceService'
import { readProducts } from '@/lib/services/storage/productService'
import { styles } from '@/lib/ui'
import { router } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useEffect, useState } from 'react'
import { Linking, ScrollView, View } from 'react-native'
import { MaskedTextInput } from 'react-native-mask-text'
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Surface,
  Text,
  TextInput
} from 'react-native-paper'
import { PaperSelect } from 'react-native-paper-select'
import { ListItem } from 'react-native-paper-select/lib/typescript/interface/paperSelect.interface'

const CreateInvoice = () => {
  const [products, setProducts] = useState<IProduct[]>([])
  const [productId, setProductId] = useState<IProduct['id']>(0)
  const [selectedProducts, setSelectedProducts] = useState<
    Omit<IReadInvoiceProductData, 'invoiceId'>[]
  >([])
  const [quantity, setQuantity] = useState<IInvoiceProduct['quantity']>(0)

  const [selectedCostumer, setSelectedCostumer] = useState<IReadCostumerData>()
  const [costumerId, setCostumerId] = useState<IInvoice['costumerId']>(0)
  const [totalValue, setTotalValue] = useState<IInvoice['totalValue']>(0)
  const [visitDate, setVisitDate] = useState<IInvoice['visitDate']>('')
  const [returnDate, setReturnDate] = useState<IInvoice['returnDate']>('')
  const [paymentMethod, setPaymentMethod] =
    useState<IInvoice['paymentMethod']>('')
  const [deadline, setDeadline] = useState<IInvoice['deadline']>('')
  const [paid, setPaid] = useState<0 | 1 | undefined>()
  const [checked, setChecked] = useState(false)

  const [realized, setRealized] = useState<IInvoice['realized']>(0)
  const [inputDate, setInputDate] = useState('31/12/2012')
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

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

  const [costumerList, setCostumerList] = useState<{
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

  const db = useSQLiteContext()
  const { addInvoice } = useInvoiceContext()
  const { costumers, setCostumers } = useCostumerContext()

  const data: ICreateInvoiceData = {
    products: selectedProducts,
    costumerId,
    totalValue,
    visitDate,
    returnDate,
    realized,
    paymentMethod,
    deadline,
    paid
  }

  const handleCreate = async () => {
    try {
      const result = await createInvoice(data, db)
      addInvoice(result)
      setIsLoading(true)
      const findCostumer = costumers.find(
        (costumer) => costumer.id === data.costumerId
      )
      if (findCostumer?.isWhatsapp === 1) {
        let textFragment = ''
        result.products.forEach((product) => {
          textFragment += `${product.quantity}x ${product.name} - ${product.price.toLocaleString(
            'pt-br',
            {
              style: 'currency',
              currency: 'BRL'
            }
          )}\n`
        })
        let possibleDeadline = ''
        if (result.paid === 0) {
          possibleDeadline = `--------------------------------\nSeu prazo de pagamento: ${result.deadline}\n`
        }
        const head = `Oi, sou o Santos, da Santos Extintores.\n\n`
        const line2 = 'Segue o resumo do seu pedido:\n\n'
        const breakline = '--------------------------------\n'
        const costumerData =
          (result.cpf !== '' && `NOME: ${result.name}\nCPF: ${result.cpf}\n`) ||
          (result.cnpj !== '' &&
            `NOME: ${result.name}\nCNPJ: ${result.cnpj}\n`) ||
          `NOME: ${result.name}\n`
        const products = textFragment
        const totalValue = `TOTAL: ${result.totalValue.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL'
        })}\n`
        const deadline = `${possibleDeadline}`
        const text =
          head +
          line2 +
          breakline +
          costumerData +
          breakline +
          products +
          breakline +
          totalValue +
          deadline +
          breakline

        const encodedText = encodeURIComponent(text)

        Linking.openURL(
          `https://wa.me/55${findCostumer?.phone}?text=${encodedText}`
        )
      }
      router.push('/invoices')
    } catch (error) {
      console.error(error)
    }
  }

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

  const getCotumers = async () => {
    try {
      const costumerData = await readCostumers(db)
      setCostumers(costumerData)

      const formattedCostumerList = costumerData.map((c) => ({
        _id: String(c.id),
        value: `${c.name} - Ctt: ${c.contactName}`
      }))

      setCostumerList((prev) => ({
        ...prev,
        list: formattedCostumerList
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddProduct = () => {
    const productData = products.find((product) => product.id === productId)
    if (productData !== undefined) {
      setSelectedProducts((prev) => {
        const existingProductIndex = prev.findIndex(
          (product) => product.productId === productId
        )

        if (existingProductIndex !== -1) {
          const updatedProducts = [...prev]
          updatedProducts[existingProductIndex].quantity += quantity
          return updatedProducts
        } else {
          const data: IReadInvoiceProductData = {
            id: productData.id,
            name: productData.name,
            productId,
            quantity,
            categoryName: productData.categoryName,
            price: productData.price,
            validityMonths: productData.validityMonths
          }
          return [...prev, data]
        }
      })
    }
  }

  const calculateTotalValue = () => {
    const total = selectedProducts.reduce((acc, product) => {
      return acc + product.quantity * product.price
    }, 0)
    setTotalValue(total)
  }

  useEffect(() => {
    getProducts()
    getCotumers()
  }, [])

  useEffect(() => {
    calculateTotalValue()
  }, [selectedProducts])

  useEffect(() => {
    const isFormValid =
      visitDate.trim().length === 10 && // Data formatada como DD/MM/AAAA
      returnDate.trim().length === 10 &&
      costumerId > 0 &&
      selectedProducts.length > 0

    setIsButtonDisabled(!isFormValid)
  }, [visitDate, returnDate, costumerId, selectedProducts])

  return (
    <Surface style={styles.indexScreen}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <TextInput
          key={1}
          label={'Data da Visita (DD/MM/AAAA)'}
          mode="outlined"
          onChangeText={(e) => setVisitDate(e.trim())}
          inputMode="tel"
          render={(props) => (
            <MaskedTextInput
              {...props}
              mask="99/99/9999"
              onChangeText={(text, rawText) => {
                props.onChangeText?.(text.trim())
                setVisitDate(text.trim())
              }}
            />
          )}
        />
        <TextInput
          key={2}
          label={'Data de Retorno (DD/MM/AAAA)'}
          mode="outlined"
          onChangeText={(e) => setReturnDate(e.trim())}
          inputMode="tel"
          render={(props) => (
            <MaskedTextInput
              {...props}
              mask="99/99/9999"
              onChangeText={(text, rawText) => {
                props.onChangeText?.(text.trim())
                setReturnDate(text.trim())
              }}
            />
          )}
        />
        <View>
          <TextInput
            key={4}
            label={'Método de Pgto.'}
            mode="outlined"
            onChangeText={(e) => setPaymentMethod(e.trim())}
            inputMode="text"
            multiline={true}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Checkbox
            status={paid ? 'checked' : 'unchecked'}
            onPress={() => {
              setPaid(paid === 0 || paid === undefined ? 1 : 0)
              setChecked(!checked)
            }}
          />
          <Text>Pagamento Feito</Text>
        </View>
        <View>
          <TextInput
            key={5}
            label={'Prazo de Pgto. (DD/MM/AAAA)'}
            mode="outlined"
            onChangeText={(e) => setDeadline(e.trim())}
            inputMode="tel"
            multiline={true}
            render={(props) => (
              <MaskedTextInput
                {...props}
                mask="99/99/9999"
                onChangeText={(text, rawText) => {
                  props.onChangeText?.(text.trim())
                  setDeadline(text.trim())
                }}
              />
            )}
            disabled={checked}
          />
        </View>
        <Text variant="titleLarge" style={{ marginTop: 10 }}>
          Cliente
        </Text>
        <Divider />
        <View style={{ marginTop: 5 }}>
          <PaperSelect
            label="Selecione Cliente"
            value={costumerList.value}
            onSelection={(value: any) => {
              setCostumerList({
                ...costumerList,
                value: value.text,
                selectedList: value.selectedList,
                error: ''
              })

              const selected = costumers.find(
                (c) => String(c.id) === value.selectedList[0]?._id
              )
              setSelectedCostumer(selected)
              setCostumerId(selected?.id ?? 0)
            }}
            arrayList={[...costumerList.list]}
            selectedArrayList={costumerList.selectedList}
            errorText={costumerList.error}
            multiEnable={false}
          />
        </View>
        <Text variant="titleLarge">Produto</Text>
        <Divider />
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
              onChangeText={(e) => setQuantity(Number(e.trim()))}
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
            {selectedProducts.map((product) => (
              <View
                key={`${product.productId}Qte${product.quantity}`}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <View>
                  <Text>
                    {product.name} - {product.categoryName}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: 'gray', marginLeft: 5 }}
                  >
                    Validade: {product.validityMonths} meses
                  </Text>
                </View>
                <Text style={{ textAlign: 'right' }}>
                  {product.quantity}x{' '}
                  {product.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </Text>
              </View>
            ))}
            {totalValue === 0 ? (
              <Text>Sem itens por enquanto...</Text>
            ) : (
              <>
                <Divider />
                <Text style={{ marginTop: 5, textAlign: 'right' }}>
                  Valor Total:{' '}
                  {totalValue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </Text>
              </>
            )}
          </Card.Content>
        </Card>
        <Button
          onPress={handleCreate}
          mode="contained"
          style={{ width: '40%', alignSelf: 'center', marginTop: 10 }}
          disabled={isButtonDisabled}
          loading={isLoading}
        >
          Criar
        </Button>
      </ScrollView>
    </Surface>
  )
}

export default CreateInvoice
