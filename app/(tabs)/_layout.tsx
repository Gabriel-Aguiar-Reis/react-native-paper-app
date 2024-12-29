import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs, router } from 'expo-router'
import React from 'react'
import { Appbar, Tooltip } from 'react-native-paper'

import { TabBar, TabsHeader } from '@/lib/ui'

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
                <Tooltip title="Filtrar">
                  <Appbar.Action
                    icon="filter"
                    onPress={() => router.push('/filter')}
                  />
                </Tooltip>
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
