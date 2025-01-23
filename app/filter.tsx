import { useCostumerContext } from '@/lib/context/CostumerContext'
import { useInvoiceContext } from '@/lib/context/InvoiceContext'
import { useProductContext } from '@/lib/context/ProductContext'
import {
  IFilters,
  IProduct,
  IReadCostumerData,
  IReadInvoiceData
} from '@/lib/interfaces'
import { readCostumers } from '@/lib/services/storage/costumerService'
import { readProducts } from '@/lib/services/storage/productService'
import { styles } from '@/lib/ui'
import { router } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'
import { View, ScrollView } from 'react-native'
import { Button, Checkbox, Surface, Text } from 'react-native-paper'
import {
  pt,
  DatePickerModal,
  registerTranslation
} from 'react-native-paper-dates'
import { PaperSelect } from 'react-native-paper-select'
import { ListItem } from 'react-native-paper-select/lib/typescript/interface/paperSelect.interface'

registerTranslation('pt', pt)

const Filter = () => {
  const [checkedRangeDates, setCheckedRangeDates] = useState(false)
  const [costumerIds, setCostumerIds] = useState<IReadCostumerData['id'][]>([])
  const [checkedCostumer, setCheckedCostumer] = useState(false)
  const [productIds, setProductIds] = useState<IProduct['id'][]>([])
  const [checkedProduct, setCheckedProduct] = useState(false)
  const [checkedRealized, setCheckedRealized] = useState(false)
  const [range, setRange] = React.useState<{
    startDate: Date | undefined
    endDate: Date | undefined
  }>({
    startDate: undefined,
    endDate: undefined
  })
  const [open, setOpen] = React.useState(false)
  const [realizedIds, setRealizedIds] = useState<
    IReadInvoiceData['realized'][]
  >([])
  const [isLoadingFilter, setIsLoadingFilter] = useState(false)
  const [isLoadingReset, setIsLoadingReset] = useState(false)

  const { filterInvoices, resetFilters, currentFilters, setCurrentFilters } =
    useInvoiceContext()
  const db = useSQLiteContext()

  const onDismiss = React.useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const onConfirm = React.useCallback(
    ({ startDate, endDate }: { startDate: any; endDate: any }) => {
      setOpen(false)
      setRange({ startDate, endDate })
    },
    [setOpen, setRange]
  )

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
  const [realizedList, setRealizedList] = useState<{
    value: string
    list: ListItem[]
    selectedList: ListItem[]
    error: string
  }>({
    value: '',
    list: [
      { _id: '1', value: 'Realizada' },
      { _id: '0', value: 'Pendente' },
      { _id: '2', value: 'Cancelada' }
    ],
    selectedList: [],
    error: ''
  })

  const getProducts = async () => {
    try {
      const productsData = await readProducts(db)

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

  const filter = () => {
    const filters: IFilters = {
      costumerIds: checkedCostumer ? costumerIds : undefined,
      productIds: checkedProduct ? productIds : undefined,
      realizedIds: checkedRealized ? realizedIds : undefined,
      startDate: checkedRangeDates ? range.startDate : undefined,
      endDate: checkedRangeDates ? range.endDate : undefined
    }

    setIsLoadingFilter(true)
    filterInvoices(filters)
    router.push('/')
  }

  useEffect(() => {
    getProducts()
    getCotumers()
  }, [])

  useEffect(() => {
    if (currentFilters) {
      setCheckedCostumer(!!currentFilters.costumerIds?.length)
      setCostumerIds(currentFilters.costumerIds || [])
      setCheckedProduct(!!currentFilters.productIds?.length)
      setProductIds(currentFilters.productIds || [])
      setCheckedRealized(!!currentFilters.realizedIds?.length)
      setRealizedIds(currentFilters.realizedIds || [])
      setCheckedRangeDates(
        !!currentFilters.startDate && !!currentFilters.endDate
      )
      setRange({
        startDate: currentFilters.startDate || undefined,
        endDate: currentFilters.endDate || undefined
      })

      // Atualiza costumerList
      const selectedCostumers = costumerList.list.filter((item) =>
        currentFilters.costumerIds?.includes(Number(item._id))
      )
      setCostumerList((prev) => ({
        ...prev,
        value: selectedCostumers.map((item) => item.value).join(', '),
        selectedList: selectedCostumers
      }))

      // Atualiza productList
      const selectedProducts = productList.list.filter((item) =>
        currentFilters.productIds?.includes(Number(item._id))
      )
      setProductList((prev) => ({
        ...prev,
        value: selectedProducts.map((item) => item.value).join(', '),
        selectedList: selectedProducts
      }))

      const selectedRealized = realizedList.list.filter((item) =>
        currentFilters.realizedIds?.map(String).includes(item._id)
      )
      setRealizedList((prev) => ({
        ...prev,
        value: selectedRealized.map((item) => item.value).join(', '),
        selectedList: selectedRealized
      }))
    }
  }, [currentFilters, costumerList.list, productList.list, realizedList.list])

  return (
    <Surface style={styles.indexScreen}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Checkbox
            status={checkedRangeDates ? 'checked' : 'unchecked'}
            onPress={() => {
              setCheckedRangeDates(!checkedRangeDates)
            }}
          />
          <Text>Período de datas</Text>
          <Button
            disabled={!checkedRangeDates}
            onPress={() => setOpen(true)}
            uppercase={false}
            mode="outlined"
          >
            Selecione as datas
          </Button>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10
          }}
        >
          <Checkbox
            status={checkedCostumer ? 'checked' : 'unchecked'}
            onPress={() => {
              setCheckedCostumer(!checkedCostumer)
            }}
          />
          <Text>Cliente</Text>
          <View style={{ width: '60%' }}>
            <PaperSelect
              disabled={!checkedCostumer}
              label="Selecione Cliente"
              value={costumerList.value}
              onSelection={(value: any) => {
                setCostumerList({
                  ...costumerList,
                  value: value.text,
                  selectedList: value.selectedList,
                  error: ''
                })

                const selectedIds = value.selectedList.map((item: any) =>
                  Number(item._id)
                )
                setCostumerIds(selectedIds)
              }}
              arrayList={[...costumerList.list]}
              selectedArrayList={costumerList.selectedList}
              errorText={costumerList.error}
              multiEnable={true}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Checkbox
            status={checkedProduct ? 'checked' : 'unchecked'}
            onPress={() => {
              setCheckedProduct(!checkedProduct)
            }}
          />
          <Text>Produto</Text>
          <View style={{ width: '60%' }}>
            <PaperSelect
              disabled={!checkedProduct}
              label="Selecione Produto"
              value={productList.value}
              onSelection={(value: any) => {
                setProductList({
                  ...productList,
                  value: value.text,
                  selectedList: value.selectedList,
                  error: ''
                })

                const selectedIds = value.selectedList.map((item: any) =>
                  Number(item._id)
                )
                setProductIds(selectedIds)
              }}
              arrayList={[...productList.list]}
              selectedArrayList={productList.selectedList}
              errorText={productList.error}
              multiEnable={true}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Checkbox
            status={checkedRealized ? 'checked' : 'unchecked'}
            onPress={() => {
              setCheckedRealized(!checkedRealized)
            }}
          />
          <Text>Troca</Text>
          <View style={{ width: '60%' }}>
            <PaperSelect
              disabled={!checkedRealized}
              label="Selecione Troca"
              value={realizedList.value}
              onSelection={(value: any) => {
                setRealizedList({
                  ...realizedList,
                  value: value.text,
                  selectedList: value.selectedList,
                  error: ''
                })

                const selectedIds = value.selectedList.map((item: any) =>
                  Number(item._id)
                )
                setRealizedIds(selectedIds)
              }}
              arrayList={[...realizedList.list]}
              selectedArrayList={realizedList.selectedList}
              errorText={realizedList.error}
              multiEnable={true}
            />
          </View>
        </View>
        <Button
          loading={isLoadingFilter}
          onPress={filter}
          mode="contained"
          style={{ width: '40%', alignSelf: 'center' }}
          disabled={
            !(
              checkedCostumer ||
              checkedProduct ||
              checkedRangeDates ||
              checkedRealized
            )
          }
        >
          Filtrar
        </Button>
        <Button
          loading={isLoadingReset}
          onPress={() => {
            resetFilters()
            setIsLoadingReset(true)
            setCurrentFilters({})
            router.push('/')
          }}
          mode="outlined"
          style={{ width: '40%', alignSelf: 'center', marginTop: 10 }}
        >
          Resetar
        </Button>
      </ScrollView>
      <DatePickerModal
        locale="pt"
        mode="range"
        visible={open}
        onDismiss={onDismiss}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onConfirm}
      />
    </Surface>
  )
}

export default Filter
