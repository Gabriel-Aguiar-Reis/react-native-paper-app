import { IContact, ICostumer, ILocation } from '@/lib/interfaces'

interface ICreateCostumerData
  extends Omit<ICostumer, 'id'>,
    Omit<IContact, 'id' | 'costumerId' | 'name'>,
    Omit<ILocation, 'id' | 'costumerId'> {
  contactName: IContact['name']
}

export default ICreateCostumerData
