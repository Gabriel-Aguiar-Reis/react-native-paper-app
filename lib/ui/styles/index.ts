/**
 * Styles
 */

import { StyleSheet } from 'react-native'

import Colors from '@/lib/ui/styles/colors'
import Themes from '@/lib/ui/styles/themes'

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderModal: {
    display: 'flex',
    alignSelf: 'center',
    padding: 20,
    width: '80%',
    borderRadius: 16,
    justifyContent: 'center'
  }
})

export { Colors, Themes, styles }
