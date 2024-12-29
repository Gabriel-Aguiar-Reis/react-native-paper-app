import { Modal, Card, Button, Text } from 'react-native-paper'

const ConfirmVisitModal = ({
  visible,
  onAction
}: {
  visible: boolean
  onAction: (action: 'generate' | 'cancel' | 'close') => void
}) => {
  return (
    <Modal visible={visible} onDismiss={() => onAction('close')}>
      <Card style={{ margin: 16, padding: 16 }}>
        <Card.Title title="Confirmação de Visita" />
        <Card.Content>
          <Text>
            Escolha uma ação de acordo com o ocorrido com a troca da visita
            realizada:
          </Text>
        </Card.Content>
        <Card.Actions style={{ justifyContent: 'space-between' }}>
          <Button mode="contained" onPress={() => onAction('generate')}>
            Feita
          </Button>
          <Button mode="outlined" onPress={() => onAction('cancel')}>
            Cancelada
          </Button>
          <Button mode="contained-tonal" onPress={() => onAction('close')}>
            Fechar
          </Button>
        </Card.Actions>
      </Card>
    </Modal>
  )
}

export default ConfirmVisitModal
