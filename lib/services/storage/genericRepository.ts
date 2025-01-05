import { SQLiteDatabase } from 'expo-sqlite'

type SQLiteBindValue = string | number | null

export class GenericRepository<T> {
  private tableName: string
  private db: SQLiteDatabase

  constructor(tableName: string, db: SQLiteDatabase) {
    this.tableName = tableName
    this.db = db
  }

  async create(data: Partial<T>): Promise<{ insertedRowId: number }> {
    try {
      const fields = Object.keys(data).join(', ')
      const placeholders = Object.keys(data)
        .map(() => '?')
        .join(', ')
      const values = Object.values(data) as SQLiteBindValue[]

      const result = await this.db.runAsync(
        `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`,
        values
      )

      return { insertedRowId: result.lastInsertRowId }
    } catch (error) {
      throw error
    }
  }

  async read(): Promise<T[]> {
    try {
      const result: T[] = await this.db.getAllSync(
        `SELECT * FROM ${this.tableName}`
      )
      return result
    } catch (error) {
      throw error
    }
  }

  async readOneRow(condition: Partial<T>): Promise<T | null> {
    try {
      const fields = Object.keys(condition)
        .map((key) => `${key} = ?`)
        .join(' AND ')
      const values = Object.values(condition) as SQLiteBindValue[]

      const result = await this.db.getFirstAsync(
        `SELECT * FROM ${this.tableName} WHERE ${fields}`,
        values
      )

      return result as T | null
    } catch (error) {
      throw error
    }
  }

  async update(data: Partial<T> & { id: number }): Promise<void> {
    try {
      const fieldsToUpdate = Object.keys(data)
        .filter((key) => key !== 'id')
        .map((key) => `${key} = ?`)
        .join(', ')
      const values = Object.values(data).filter(
        (_, index) => Object.keys(data)[index] !== 'id'
      ) as SQLiteBindValue[]

      await this.db.runAsync(
        `UPDATE ${this.tableName} SET ${fieldsToUpdate} WHERE id = ?`,
        [...values, data.id]
      )
    } catch (error) {
      throw error
    }
  }

  async destroy(id: number): Promise<void> {
    try {
      await this.db.runAsync(`DELETE FROM ${this.tableName} WHERE id = ?`, [id])
    } catch (error) {
      throw error
    }
  }
}
