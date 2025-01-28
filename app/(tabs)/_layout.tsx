import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs, router } from 'expo-router'
import React from 'react'
import { Appbar, Tooltip } from 'react-native-paper'

import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import XLSX from 'xlsx'
import { useSQLiteContext } from 'expo-sqlite'

import { TabBar, TabsHeader } from '@/lib/ui'
import { GenericRepository } from '@/lib/services/storage/genericRepository'
import {
  ICostumer,
  ILocation,
  IContact,
  ICategory,
  IInvoice,
  IInvoiceProduct,
  IProduct
} from '@/lib/interfaces'

const TabLayout = () => {
  const tabs = [
    {
      key: 1,
      name: 'index',
      createName: undefined,
      title: 'Roteiro',
      iconFocused: 'home' as const,
      iconUnfocused: 'home-outline' as const
    },
    {
      key: 2,
      name: 'costumers',
      createName: 'costumer',
      title: 'Clientes',
      iconFocused: 'account-box-multiple' as const,
      iconUnfocused: 'account-box-multiple-outline' as const
    },
    {
      key: 3,
      name: 'products',
      createName: 'product',
      title: 'Produtos',
      iconFocused: 'basket' as const,
      iconUnfocused: 'basket-outline' as const
    },
    {
      key: 4,
      name: 'invoices',
      createName: 'invoice',
      title: 'Ordens',
      iconFocused: 'book' as const,
      iconUnfocused: 'book-outline' as const
    }
  ] as const

  const db = useSQLiteContext()

  const handleDownload = async () => {
    try {
      // Passo 1: Ler os dados da tabela SQLite
      const costumerRepo = new GenericRepository<ICostumer>('costumers', db)
      const costumerLocationRepo = new GenericRepository<ILocation>(
        'locations',
        db
      )
      const costumerContactRepo = new GenericRepository<IContact>(
        'contacts',
        db
      )
      const categoryRepo = new GenericRepository<ICategory>('categories', db)
      const invoiceRepo = new GenericRepository<IInvoice>('invoices', db)
      const invoiceProdRepo = new GenericRepository<IInvoiceProduct>(
        'invoice_products',
        db
      )
      const productRepo = new GenericRepository<IProduct>('products', db)

      const costumers = await costumerRepo.read()
      const costumersLocations = await costumerLocationRepo.read()
      const costumersContacts = await costumerContactRepo.read()
      const categories = await categoryRepo.read()
      const invoices = await invoiceRepo.read()
      const invoicesProducts = await invoiceProdRepo.read()
      const products = await productRepo.read()

      // Passo 2: Converter os dados em uma planilha
      const workbook = XLSX.utils.book_new()

      const worksheetCostumers = XLSX.utils.json_to_sheet(costumers)
      XLSX.utils.book_append_sheet(workbook, worksheetCostumers, 'Clientes')

      const worksheetCostumersLocations =
        XLSX.utils.json_to_sheet(costumersLocations)
      XLSX.utils.book_append_sheet(
        workbook,
        worksheetCostumersLocations,
        'Dados de endereço'
      )

      const worksheetCostumersContacts =
        XLSX.utils.json_to_sheet(costumersContacts)
      XLSX.utils.book_append_sheet(
        workbook,
        worksheetCostumersContacts,
        'Dados de contato'
      )

      const worksheetCategories = XLSX.utils.json_to_sheet(categories)
      XLSX.utils.book_append_sheet(workbook, worksheetCategories, 'Categorias')

      const worksheetInvoices = XLSX.utils.json_to_sheet(invoices)
      XLSX.utils.book_append_sheet(workbook, worksheetInvoices, 'Ordens')

      const worksheetInvoicesProducts =
        XLSX.utils.json_to_sheet(invoicesProducts)
      XLSX.utils.book_append_sheet(
        workbook,
        worksheetInvoicesProducts,
        'Produtos de ordens'
      )

      const worksheetProducts = XLSX.utils.json_to_sheet(products)
      XLSX.utils.book_append_sheet(workbook, worksheetProducts, 'Produtos')

      // Passo 3: Gerar o arquivo Excel em formato binário
      const excelData = XLSX.write(workbook, {
        type: 'binary',
        bookType: 'xlsx'
      })

      // Função auxiliar para converter string para buffer
      const stringToBuffer = (s: string) => {
        const buf = new ArrayBuffer(s.length)
        const view = new Uint8Array(buf)
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff
        return buf
      }

      const buffer = stringToBuffer(excelData)

      const today = (() => {
        const now = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        const day = pad(now.getDate())
        const month = pad(now.getMonth() + 1)
        const year = now.getFullYear()
        const hours = pad(now.getHours())
        const minutes = pad(now.getMinutes())
        return `${day}${month}${year}_${hours}${minutes}`
      })()

      // Passo 4: Salvar o arquivo no dispositivo
      const fileUri =
        FileSystem.documentDirectory + `${today}_database_export.xlsx`
      // Converte o buffer para uma string Base64
      const base64ExcelData = btoa(
        String.fromCharCode(...new Uint8Array(buffer))
      )

      await FileSystem.writeAsStringAsync(fileUri, base64ExcelData, {
        encoding: FileSystem.EncodingType.Base64
      })

      // Passo 5: Compartilhar ou abrir o arquivo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri)
      } else {
        console.log('Arquivo salvo em:', fileUri)
      }
    } catch (error) {
      console.error('Erro ao exportar a base de dados:', error)
    }
  }

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        header: (props) => <TabsHeader navProps={props} children={undefined} />
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.key}
          name={tab.name}
          options={{
            title: tab.title,
            headerRight: () =>
              tab.name === 'index' ? (
                <>
                  <Tooltip title="Baixar">
                    <Appbar.Action
                      icon="file-download"
                      onPress={handleDownload}
                    />
                  </Tooltip>
                  <Tooltip title="Filtrar">
                    <Appbar.Action
                      icon="filter"
                      onPress={() => router.push('/filter')}
                    />
                  </Tooltip>
                </>
              ) : (
                <Tooltip title="Adicionar">
                  <Appbar.Action
                    icon="plus"
                    onPress={() => router.push(`/${tab.createName}`)}
                  />
                </Tooltip>
              ),
            tabBarIcon: (props) => (
              <MaterialCommunityIcons
                {...props}
                size={24}
                name={props.focused ? tab.iconFocused : tab.iconUnfocused}
              />
            )
          }}
        />
      ))}
    </Tabs>
  )
}

export default TabLayout
