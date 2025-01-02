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
  const costumerLocationRepo = new GenericRepository<
    Omit<ILocation, 'costumerId'> & { costumer_id: string }
  >('locations', db)
  const costumerContactRepo = new GenericRepository<
    Omit<IContact, 'costumerId'> & { costumer_id: string }
  >('contacts', db)
  try {
    const { insertedRowId: costumerId } = await costumerRepo.create({
      name: costumer.name
    })
    await costumerLocationRepo.create({
      ...costumer.locationData,
      costumer_id: costumerId
    })

    await costumerContactRepo.create({
      ...costumer.contactData,
      costumer_id: costumerId
    })

    const result = (await db.getFirstAsync(
      `
      SELECT  
        c.id AS id, 
        c.name AS name, 
        l.id AS location_id,
        l.street, 
        l.number, 
        l.neighbourhood, 
        l.city, 
        l.CEP, 
        t.id AS contact_id,
        t.name AS contact_name, 
        t.phone, 
        t.isWhatsapp
      FROM 
        costumers c
      LEFT JOIN locations l ON l.costumer_id = c.id
      LEFT JOIN contacts t ON t.costumer_id = c.id
      WHERE c.id = ?;
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
  try {
    const allCostumers = await costumerRepo.read()
    return allCostumers
  } catch (error) {
    throw new Error(`Falha ao buscar clientes: ${error}`)
  }
}

// const costumerRepository = new GenericRepository<ICostumer>('costumer');

// // Criar um cliente
// await costumerRepository.create({ name: 'John Doe' });

// // Ler todos os clientes
// const allCostumers = await costumerRepository.read();

// // Ler um cliente específico
// const specificCostumer = await costumerRepository.readOneRow({ id: 1 });

// // Atualizar um cliente
// await costumerRepository.update({ id: 1, name: 'Updated Name' });

// // Deletar um cliente
// await costumerRepository.destroy(1);
