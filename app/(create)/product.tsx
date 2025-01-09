import { useProductContext } from '@/lib/context/ProductContext'
import { ICategory, ICreateProductData } from '@/lib/interfaces'
import { readCategories } from '@/lib/services/storage/categoryService'
import { createProduct } from '@/lib/services/storage/productsService'
import { styles } from '@/lib/ui'
import { router } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { MaskedTextInput } from 'react-native-mask-text'
import {
  Button,
  Checkbox,
  Divider,
  Surface,
  Text,
  TextInput
} from 'react-native-paper'
import { Dropdown, Option } from 'react-native-paper-dropdown'

const CreateProduct = () => {
  const [name, setProName] = useState<ICreateProductData['name']>('')
  const [price, setPrice] = useState<ICreateProductData['price']>(0)
  const [validityMonths, setValidityMonths] =
    useState<ICreateProductData['validityMonths']>(0)
  const [categoryName, setCategoryName] =
    useState<ICreateProductData['categoryName']>('')
  const [checked, setChecked] = useState(false)
  const [categories, setCategories] = useState<ICategory[]>([])

  const db = useSQLiteContext()
  const { addProduct } = useProductContext()

  const OPTIONS: Option[] = []

  categories.forEach((category) => {
    let obj: Option = {
      label: category.name,
      value: category.name
    }
    OPTIONS.push(obj)
  })

  const data: ICreateProductData = {
    name: name,
    price: price,
    validityMonths: validityMonths,
    categoryName: categoryName
  }

  const handleCreate = async () => {
    try {
      const result = await createProduct(data, db)
      addProduct(result)
      router.push('/products')
    } catch (error) {
      console.error(error)
    }
  }

  const getCategories = async () => {
    try {
      const categoriesData = await readCategories(db)
      setCategories(categoriesData)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <Surface style={styles.indexScreen}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <TextInput
          key={1}
          label={'Nome do Produto'}
          mode="outlined"
          onChangeText={(e) => setProName(e)}
          multiline={true}
        />
        <TextInput
          key={2}
          label={'Preço - R$'}
          defaultValue="0,00"
          render={(props) => (
            <MaskedTextInput
              {...props}
              type="currency"
              options={{
                decimalSeparator: ',',
                precision: 2
              }}
              onChangeText={(text, rawText) => {
                props.onChangeText?.(rawText)
                setPrice(Number(text.replace(',', '.')))
              }}
              keyboardType="decimal-pad"
            />
          )}
          mode="outlined"
          multiline={true}
        />
        <TextInput
          key={3}
          label={'Meses de Validade'}
          mode="outlined"
          onChangeText={(e) => setValidityMonths(Number(e))}
          inputMode="numeric"
          multiline={true}
        />
        <Text variant="titleLarge" style={{ marginVertical: 10 }}>
          Categoria
        </Text>
        <Divider />
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 5, flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked)
              }}
            />
            <Text>Nova</Text>
          </View>
          <View style={{ flex: 15 }}>
            <TextInput
              key={4}
              label={'Nome da Nova Categoria'}
              mode="outlined"
              onChangeText={(e) => setCategoryName(e)}
              multiline={true}
              disabled={!checked}
            />
          </View>
        </View>
        <Dropdown
          label="Categorias"
          placeholder="Selecione Categorias"
          options={OPTIONS}
          value={categoryName}
          onSelect={(e) => (e !== undefined ? setCategoryName(e) : '')}
          mode="outlined"
          disabled={categories.length === 0 ? true : checked}
        />
        <Button
          onPress={handleCreate}
          mode="contained"
          style={{ width: '40%', alignSelf: 'center', marginTop: 10 }}
        >
          Criar
        </Button>
      </ScrollView>
    </Surface>
  )
}

export default CreateProduct
