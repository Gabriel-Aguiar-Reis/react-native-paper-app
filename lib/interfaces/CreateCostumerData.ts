import { IContact, ICostumer, ILocation } from '@/lib/interfaces'

interface ICreateCostumerData {
  name: ICostumer['name']
  locationData: Omit<ILocation, 'id' | 'costumerId'>
  contactData: Omit<IContact, 'id' | 'costumerId'>
}

export default ICreateCostumerData
