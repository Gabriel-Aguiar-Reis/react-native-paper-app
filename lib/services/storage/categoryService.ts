import { ICategory } from '@/lib/interfaces'
import { GenericRepository } from '@/lib/services/storage/genericRepository'
import { SQLiteDatabase } from 'expo-sqlite'

export async function createCategory(
  name: ICategory['name'],
  db: SQLiteDatabase
): Promise<ICategory> {
  const categoryRepo = new GenericRepository<ICategory>('categories', db)
  try {
    let result: ICategory
    const categoryData = await categoryRepo.readOneRow({
      name
    })
    if (categoryData === null) {
      const { insertedRowId: id } = await categoryRepo.create({ name })
      result = {
        id,
        name
      }
    } else {
      const id = categoryData.id
      result = {
        id,
        name
      }
    }

    return result
  } catch (error) {
    throw error
  }
}

export async function readCategories(db: SQLiteDatabase): Promise<ICategory[]> {
  const categoryRepo = new GenericRepository<ICategory>('categories', db)
  try {
    const categoriesData = categoryRepo.read()
    return categoriesData
  } catch (error) {
    throw new Error(`Falha ao buscar categorias: ${error}`)
  }
}
