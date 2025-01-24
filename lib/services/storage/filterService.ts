import { IFilters, IStoredFilters } from '@/lib/interfaces'
import { GenericRepository } from '@/lib/services/storage/genericRepository'
import { SQLiteDatabase } from 'expo-sqlite'

export async function setFilters(db: SQLiteDatabase, filters: IFilters) {
  const filtersRepo = new GenericRepository<IStoredFilters>(
    'stored_filters',
    db
  )
  try {
    const filter = await filtersRepo.read()
    if (filter.length === 0) {
      await filtersRepo.create({
        value: JSON.stringify(filters)
      })
    } else {
      await filtersRepo.update({
        value: JSON.stringify(filters),
        id: filter[0].id
      })
    }
  } catch (error) {}
}
export async function getFilters(db: SQLiteDatabase): Promise<IStoredFilters> {
  try {
    const res = (await db.getFirstAsync(
      `
        SELECT
          id,
          value
        FROM
          stored_filters
        `
    )) as IStoredFilters

    return res
  } catch (error) {
    throw error
  }
}
