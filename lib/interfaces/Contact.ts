import ICostumer from '@/lib/interfaces/Costumer'

interface IContact {
  id: number
  name: string
  phone: string
  isWhatsapp: number
  costumerId: ICostumer['id']
}

export default IContact
