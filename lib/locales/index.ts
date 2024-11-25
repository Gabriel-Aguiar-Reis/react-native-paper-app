/**
 * Locales
 */

import { I18n } from 'i18n-js'

import English from '@/lib/locales/en'
import PortugueseBR from '@/lib/locales/pt-br'

const Locales = new I18n({
  en: English,
  ptbr: PortugueseBR
})

Locales.enableFallback = true

export default Locales
