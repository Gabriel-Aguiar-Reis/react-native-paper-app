import ICostumer from '@/lib/interfaces/Costumer'

interface ILocation {
  id: number
  street: string
  number: number
  neighbourhood: string
  city: string
  zipCode: string
  costumerId: ICostumer['id']
}

export default ILocation
