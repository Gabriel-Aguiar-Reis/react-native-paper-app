import { IContact, ILocation } from '@/lib/interfaces'

interface ICostumer {
  id: number
  name: string
  locationData: ILocation
  contactData: IContact
}

export default ICostumer
