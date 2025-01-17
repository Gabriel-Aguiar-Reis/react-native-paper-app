/**
 * Themes
 */

import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper'

import Colors from '@/lib/ui/styles/colors'

const fonts = configureFonts({ config: { fontFamily: 'NotoSans_400Regular' } })

const BaseLightTheme = {
  ...MD3LightTheme,
  fonts
}

const BaseDarkTheme = {
  ...MD3DarkTheme,
  fonts
}

const Themes = {
  light: {
    default: BaseLightTheme,
    blue: {
      ...BaseLightTheme,
      colors: {
        ...BaseLightTheme.colors,
        ...Colors.light.blue
      }
    }
  },
  dark: {
    default: BaseDarkTheme,

    blue: {
      ...BaseDarkTheme,
      colors: {
        ...BaseDarkTheme.colors,
        ...Colors.dark.blue
      }
    }
  }
}

export default Themes
