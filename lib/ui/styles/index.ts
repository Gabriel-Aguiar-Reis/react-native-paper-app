/**
 * Styles
 */

import { StyleSheet } from 'react-native'

import Colors from '@/lib/ui/styles/colors'
import Themes from '@/lib/ui/styles/themes'

const styles = StyleSheet.create({
  indexScreen: {
    flex: 1 as const,
    gap: 16 as const,
    padding: 32 as const
  },
  screen: {
    flex: 1 as const,
    gap: 16 as const,
    padding: 32 as const,
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderModal: {
    display: 'flex',
    alignSelf: 'center',
    padding: 20 as const,
    width: '80%',
    borderRadius: 16 as const,
    justifyContent: 'center'
  }
})

export { Colors, Themes, styles }
