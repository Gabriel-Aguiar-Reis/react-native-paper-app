import { ICreateProductData, IProduct } from '@/lib/interfaces'
import { createCategory } from '@/lib/services/storage/categoryService'
import { GenericRepository } from '@/lib/services/storage/genericRepository'
import { SQLiteDatabase } from 'expo-sqlite'

export async function createProduct(
  product: ICreateProductData,
  db: SQLiteDatabase
): Promise<IProduct> {
  const productRepo = new GenericRepository<IProduct>('products', db)
  try {
    await createCategory(product.categoryName, db)

    const { insertedRowId: id } = await productRepo.create({
      ...product
    })

    const result = (await db.getFirstAsync(
      `
        SELECT
          id,
          name,
          price,
          validityMonths,
          categoryName
        FROM 
          products
        WHERE id = ?;
        `,
      [id]
    )) as IProduct

    return result
  } catch (error) {
    throw error
  }
}

export async function readProducts(db: SQLiteDatabase): Promise<IProduct[]> {
  const productRepo = new GenericRepository<IProduct>('products', db)
  try {
    const productsData = productRepo.read()
    return productsData
  } catch (error) {
    throw new Error(`Falha ao buscar produtos: ${error}`)
  }
}
