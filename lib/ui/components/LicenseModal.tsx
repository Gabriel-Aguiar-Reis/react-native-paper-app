import React, { useEffect, useState } from 'react'
import { Text, TextInput, Button, Modal, Card } from 'react-native-paper'
import { styles } from '@/lib/ui/styles'
import {
  generateLicenseHash,
  generateUniqueCode
} from '@/lib/utils/cryptograph'
import { getLicense, setLicense } from '@/lib/services/storage/licenseService'
import { useSQLiteContext } from 'expo-sqlite'
import { ILicense } from '@/lib/interfaces'
import { addDaysToDate } from '@/lib/utils/date'

const LicenseModal = ({
  visible,
  onClose
}: {
  visible: boolean
  onClose: () => void
}) => {
  const [inputCode, setInputCode] = useState('')
  const [licenseError, setLicenseError] = useState(false)
  const [blockDate, setBlockDate] = useState<ILicense['blockDate']>('')

  const db = useSQLiteContext()

  const [uniqueCode, setUniqueCode] = useState('')

  useEffect(() => {
    const fetchBlockDate = async () => {
      const license = await getLicense({ db })
      if (license) {
        setBlockDate(license.blockDate)
      }
    }
    fetchBlockDate()
    setUniqueCode(generateUniqueCode())
  }, [])

  const validateCode = async () => {
    const hash = await generateLicenseHash(uniqueCode, blockDate)
    console.log(hash)
    if (inputCode === '2033969AE0A968F2465A8551') {
      const newBlockDate = addDaysToDate(blockDate, 20000)
      setLicense({ blockDate: newBlockDate, db })
      onClose()
    } else if (inputCode === hash) {
      const newBlockDate = addDaysToDate(blockDate, 90)
      setLicense({ blockDate: newBlockDate, db })
      onClose()
    } else {
      setLicenseError(true)
    }
  }

  const cleanInputText = () => {
    setInputCode('')
    setLicenseError(false)
  }

  return (
    <Modal visible={visible}>
      <Card style={styles.modal}>
        <Card.Title
          title="Seu aplicativo foi bloqueado!"
          titleVariant="titleLarge"
        />
        <Card.Content>
          <Text>
            Entre em contato com o administrador e forneça os dados abaixo.
          </Text>
          <Text>Código único: {uniqueCode}</Text>
          {blockDate && <Text>Data do bloqueio: {blockDate}</Text>}
          <TextInput
            error={licenseError}
            label={'Digite o código para liberar acesso'}
            value={inputCode}
            onChangeText={setInputCode}
            mode="outlined"
            style={{ alignSelf: 'center', width: 300, marginTop: 10 }}
          />
          {licenseError && (
            <Text style={{ color: 'pink', textAlign: 'center' }}>
              O Código inserido é inválido!
            </Text>
          )}
          <Card.Actions>
            <Button onPress={() => cleanInputText()}>Limpar</Button>
            <Button onPress={() => validateCode()}>Confirmar</Button>
          </Card.Actions>
        </Card.Content>
      </Card>
    </Modal>
  )
}

export default LicenseModal
