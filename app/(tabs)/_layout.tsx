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
      title: 'Tela Inicial',
      iconFocused: 'home' as const,
      iconUnfocused: 'home-outline' as const
    },
    {
      key: 2,
      name: 'costumers',
      title: 'Clientes',
      iconFocused: 'account-box-multiple' as const,
      iconUnfocused: 'account-box-multiple-outline' as const
    },
    {
      key: 3,
      name: 'products',
      title: 'Produtos',
      iconFocused: 'basket' as const,
      iconUnfocused: 'basket-outline' as const
    },
    {
      key: 4,
      name: 'invoices',
      title: 'Ordens',
      iconFocused: 'book' as const,
      iconUnfocused: 'book-outline' as const
    },
    {
      key: 5,
      name: 'settings',
      title: 'Configs',
      iconFocused: 'cog' as const,
      iconUnfocused: 'cog-outline' as const
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
      {tabs.map((tab) =>
        tab.name === 'settings' ? (
          <Tabs.Screen
            key={tab.key}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: (props) => (
                <MaterialCommunityIcons
                  {...props}
                  size={24}
                  name={props.focused ? tab.iconFocused : tab.iconUnfocused}
                />
              )
            }}
          />
        ) : (
          <Tabs.Screen
            key={tab.key}
            name={tab.name}
            options={{
              title: tab.title,
              headerRight: () => (
                <>
                  <Tooltip title="Pesquisar">
                    <Appbar.Action
                      icon="magnify"
                      onPress={() => router.push('/search')}
                    />
                  </Tooltip>
                  <Tooltip title="Configs">
                    <Appbar.Action
                      icon="cog"
                      onPress={() => router.push('/(tabs)/settings')}
                    />
                  </Tooltip>
                </>
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
        )
      )}
    </Tabs>
  )
}

export default TabLayout
