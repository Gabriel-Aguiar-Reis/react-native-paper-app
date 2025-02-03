import {
  IContact,
  ICostumer,
  ICreateCostumerData,
  ILocation,
  IReadCostumerData
} from '@/lib/interfaces'
import { GenericRepository } from '@/lib/services/storage/genericRepository'
import { SQLiteDatabase } from 'expo-sqlite'

export async function createCostumer(
  costumer: ICreateCostumerData,
  db: SQLiteDatabase
): Promise<IReadCostumerData> {
  const costumerRepo = new GenericRepository<ICostumer>('costumers', db)
  const costumerLocationRepo = new GenericRepository<ILocation>('locations', db)
  const costumerContactRepo = new GenericRepository<IContact>('contacts', db)
  try {
    const { insertedRowId: costumerId } = await costumerRepo.create({
      name: costumer.name,
      cpf: costumer.cpf,
      cnpj: costumer.cnpj
    })

    const locationData = {
      street: costumer.street,
      number: costumer.number,
      neighbourhood: costumer.neighbourhood,
      city: costumer.city,
      zipCode: costumer.zipCode,
      costumerId
    }

    await costumerLocationRepo.create({
      ...locationData
    })

    const contactData = {
      name: costumer.contactName,
      phone: costumer.phone,
      isWhatsapp: costumer.isWhatsapp,
      costumerId
    }
    await costumerContactRepo.create({
      ...contactData
    })

    const result = (await db.getFirstAsync(
      `
      SELECT
        c.id,
        c.name,
        l.id AS locationId,
        l.street,
        l.number,
        l.neighbourhood,
        l.city,
        l.zipCode,
        t.id AS contactId,
        t.name AS contactName,
        t.phone,
        t.isWhatsapp
      FROM
        costumers c
      INNER JOIN locations l ON l.id = c.id
      INNER JOIN contacts t ON t.id = c.id
      WHERE c.id = ?;
      `,
      [costumerId]
    )) as IReadCostumerData

    return result
  } catch (error) {
    throw error
  }
}

export async function readCostumers(
  db: SQLiteDatabase
): Promise<IReadCostumerData[]> {
  try {
    const result = (await db.getAllAsync(`
      SELECT
        c.id,
        c.name,
        c.cpf,
        c.cnpj,
        l.id AS locationId,
        l.street,
        l.number,
        l.neighbourhood,
        l.city,
        l.zipCode,
        t.id AS contactId,
        t.name AS contactName,
        t.phone,
        t.isWhatsapp
      FROM
        costumers c
      LEFT JOIN
        locations l ON c.id = l.costumerId
      LEFT JOIN
        contacts t ON c.id = t.costumerId
    `)) as IReadCostumerData[]

    const formattedData: IReadCostumerData[] = result.map((row) => ({
      id: row.id,
      cpf: row.cpf,
      cnpj: row.cnpj,
      locationId: row.locationId,
      contactId: row.contactId,
      name: row.name,
      street: row.street,
      number: row.number,
      neighbourhood: row.neighbourhood,
      city: row.city,
      zipCode: row.zipCode,
      contactName: row.contactName,
      phone: row.phone,
      isWhatsapp: row.isWhatsapp
    }))

    return formattedData
  } catch (error) {
    throw new Error(`Falha ao buscar clientes: ${error}`)
  }
}

export async function deleteCostumer(db: SQLiteDatabase, id: number) {
  try {
    const costumerRepo = new GenericRepository<ICostumer>('costumers', db)
    const res = costumerRepo.destroy(id)
    return res
  } catch (error) {
    throw error
  }
}

export async function updateCostumer(
  costumer: IReadCostumerData,
  db: SQLiteDatabase
): Promise<void> {
  const costumerRepo = new GenericRepository<ICostumer>('costumers', db)
  const costumerLocationRepo = new GenericRepository<ILocation>('locations', db)
  const costumerContactRepo = new GenericRepository<IContact>('contacts', db)

  try {
    await costumerRepo.update({
      name: costumer.name,
      cpf: costumer.cpf,
      cnpj: costumer.cnpj,
      id: costumer.id
    })

    const locationData = {
      id: costumer.locationId,
      street: costumer.street,
      number: costumer.number,
      neighbourhood: costumer.neighbourhood,
      city: costumer.city,
      zipCode: costumer.zipCode
    }
    await costumerLocationRepo.update(locationData)

    const contactData = {
      id: costumer.contactId,
      name: costumer.contactName,
      phone: costumer.phone,
      isWhatsapp: costumer.isWhatsapp
    }
    await costumerContactRepo.update(contactData)
  } catch (error) {
    throw new Error(`Erro ao atualizar cliente: ${error}`)
  }
}
