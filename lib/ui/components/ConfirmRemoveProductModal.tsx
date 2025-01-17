import { Modal, Card, Button, Text } from 'react-native-paper'

const ConfirmRemoveProductModal = ({
  visible,
  onAction,
  onDismiss
}: {
  visible: boolean
  onAction: () => void
  onDismiss: () => void
}) => {
  return (
    <Modal visible={visible} onDismiss={onDismiss}>
      <Card style={{ margin: 16, padding: 16 }}>
        <Card.Title title="Confirmação de Remoção" />
        <Card.Content>
          <Text>
            Deseja realmente remover o produto selecionado? Essa ação não poderá
            ser desfeita!
          </Text>
        </Card.Content>
        <Card.Actions style={{ justifyContent: 'space-between' }}>
          <Button mode="contained" onPress={() => onAction()}>
            Remover
          </Button>
          <Button mode="contained-tonal" onPress={onDismiss}>
            Fechar
          </Button>
        </Card.Actions>
      </Card>
    </Modal>
  )
}

export default ConfirmRemoveProductModal
