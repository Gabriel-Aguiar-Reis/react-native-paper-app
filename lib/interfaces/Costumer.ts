import { IContact, ILocation } from '@/lib/interfaces'

interface ICostumer {
  cosId: number
  cosName: string
  locationData: ILocation
  contactData: IContact
}

export default ICostumer
