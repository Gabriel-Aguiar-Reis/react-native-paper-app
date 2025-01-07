import {
  IContact,
  ICostumer,
  ICreateCostumerData,
  ILocation
} from '@/lib/interfaces'
import { GenericRepository } from '@/lib/services/storage/genericRepository'
import { SQLiteDatabase } from 'expo-sqlite'

export async function createCostumer(
  costumer: ICreateCostumerData,
  db: SQLiteDatabase
): Promise<ICostumer> {
  const costumerRepo = new GenericRepository<ICostumer>('costumers', db)
  const costumerLocationRepo = new GenericRepository<ILocation>('locations', db)
  const costumerContactRepo = new GenericRepository<IContact>('contacts', db)
  try {
    const { insertedRowId: costumerId } = await costumerRepo.create({
      cosName: costumer.cosName
    })
    await costumerLocationRepo.create({
      ...costumer.locationData,
      costumerId
    })

    await costumerContactRepo.create({
      ...costumer.contactData,
      costumerId
    })

    const result = (await db.getFirstAsync(
      `
      SELECT  
        c.cosId, 
        c.cosName, 
        l.locId,
        l.street, 
        l.number, 
        l.neighbourhood, 
        l.city, 
        l.CEP, 
        t.conId,
        t.conName, 
        t.phone, 
        t.isWhatsapp
      FROM 
        costumers c
      LEFT JOIN locations l ON l.costumerId = c.cosId
      LEFT JOIN contacts t ON t.costumerId = c.cosId
      WHERE c.cosId = ?;
      `,
      [costumerId]
    )) as ICostumer

    return result
  } catch (error) {
    throw error
  }
}

export async function readCostumers(db: SQLiteDatabase): Promise<ICostumer[]> {
  const costumerRepo = new GenericRepository<ICostumer>('costumers', db)
  const costumerLocationRepo = new GenericRepository<ILocation>('locations', db)
  const costumerContactRepo = new GenericRepository<IContact>('contacts', db)
  try {
    const costumerData = await costumerRepo.read()
    const locationData = await costumerLocationRepo.read()
    const contactData = await costumerContactRepo.read()

    const returnData: ICostumer[] = []

    costumerData.forEach((costumer) => {
      const relatedLocation = locationData.find(
        (location) => location.costumerId === costumer.cosId
      )
      const relatedContact = contactData.find(
        (contact) => contact.costumerId === costumer.cosId
      )

      const data: ICostumer = {
        cosId: costumer.cosId,
        cosName: costumer.cosName,
        locationData: relatedLocation || {
          locId: 0,
          street: '',
          number: 0,
          neighbourhood: '',
          city: '',
          CEP: '',
          costumerId: 0
        },
        contactData: relatedContact || {
          conId: 0,
          conName: '',
          phone: '',
          isWhatsapp: 0,
          costumerId: 0
        }
      }

      returnData.push(data)
    })

    return returnData
  } catch (error) {
    throw new Error(`Falha ao buscar clientes: ${error}`)
  }
}
