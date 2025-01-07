import { IContact, ICostumer, ILocation } from '@/lib/interfaces'

interface ICreateCostumerData {
  cosName: ICostumer['cosName']
  locationData: Omit<ILocation, 'locId' | 'costumerId'>
  contactData: Omit<IContact, 'conId' | 'costumerId'>
}

export default ICreateCostumerData
