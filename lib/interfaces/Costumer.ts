import { IContact, ILocation } from '@/lib/interfaces'

interface ICostumer {
  id: string
  name: string
  locationData: ILocation
  contactData: IContact
}

export default ICostumer
