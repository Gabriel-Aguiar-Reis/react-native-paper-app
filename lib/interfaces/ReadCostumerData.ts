import {
  IContact,
  ICostumer,
  ICreateCostumerData,
  ILocation
} from '@/lib/interfaces'

interface IReadCostumerData extends ICreateCostumerData {
  id: ICostumer['id']
  locationId: ILocation['id']
  contactId: IContact['costumerId']
}

export default IReadCostumerData
