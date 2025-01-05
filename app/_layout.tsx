import { MaterialCommunityIcons } from '@expo/vector-icons'
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono'
import { NotoSans_400Regular } from '@expo-google-fonts/noto-sans'
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  ThemeProvider
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import React from 'react'
import { useColorScheme } from 'react-native'
import { adaptNavigationTheme, PaperProvider } from 'react-native-paper'

import { Setting } from '@/lib/types'
import { Themes } from '@/lib/ui'
import { SQLiteProvider } from 'expo-sqlite'
import { initializeDatabase } from '@/lib/services/storage/sqliteDBService'
import { CostumerProvider } from '@/lib/context/CostumerContext'
export { ErrorBoundary } from 'expo-router'

export const unstable_settings = { initialRouteName: '(tabs)' }

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [loaded, error] = useFonts({
    NotoSans_400Regular,
    JetBrainsMono_400Regular,
    ...MaterialCommunityIcons.font
  })

  React.useEffect(() => {
    if (error) throw error
  }, [error])

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

const RootLayoutNav = () => {
  const colorScheme = useColorScheme()
  const [settings, setSettings] = React.useState<Setting>({
    theme: 'auto',
    color: 'blue'
  })

  React.useEffect(() => {
    setSettings({ ...settings, theme: colorScheme ?? 'light' })
  }, [])

  const theme =
    Themes[
      settings.theme === 'auto' ? (colorScheme ?? 'dark') : settings.theme
    ][settings.color]

  const { DarkTheme, LightTheme } = adaptNavigationTheme({
    reactNavigationDark: NavDarkTheme,
    reactNavigationLight: NavLightTheme,
    materialDark: Themes.dark[settings.color],
    materialLight: Themes.light[settings.color]
  })

  const createStack = [
    { name: 'costumer', title: 'Criar Novo Cliente' },
    { name: 'invoice', title: 'Criar Nova Ordem de Visita' },
    { name: 'product', title: 'Criar Novo Produto' }
  ]
  return (
    <ThemeProvider
      value={
        colorScheme === 'light'
          ? { ...LightTheme, fonts: NavLightTheme.fonts }
          : { ...DarkTheme, fonts: NavDarkTheme.fonts }
      }
    >
      <PaperProvider theme={theme}>
        <SQLiteProvider databaseName="sqlite.db" onInit={initializeDatabase}>
          <CostumerProvider>
            <Stack
              screenOptions={{
                animation: 'slide_from_bottom'
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="filter" options={{ title: 'Filtrar' }} />
              {createStack.map((stack) => (
                <Stack.Screen
                  name={`(create)/${stack.name}`}
                  options={{ title: stack.title }}
                />
              ))}
            </Stack>
          </CostumerProvider>
        </SQLiteProvider>
      </PaperProvider>
    </ThemeProvider>
  )
}

export default RootLayout
