import { SQLiteDatabase } from 'expo-sqlite'

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA foreign_keys = ON;
    
    CREATE TABLE IF NOT EXISTS costumers (
      cosId INTEGER PRIMARY KEY AUTOINCREMENT,
      cosName TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS locations (
      locId INTEGER PRIMARY KEY AUTOINCREMENT,
      costumerId INTEGER REFERENCES costumers (cosId) ON DELETE CASCADE,
      street TEXT NOT NULL,
      number INTEGER NOT NULL,
      neighbourhood TEXT NOT NULL,
      city TEXT NOT NULL,
      CEP TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      conId INTEGER PRIMARY KEY AUTOINCREMENT,
      costumerId INTEGER REFERENCES costumers (cosId) ON DELETE CASCADE,
      conName TEXT NOT NULL,
      phone TEXT NOT NULL,
      isWhatsapp INTEGER NOT NULL -- 0 or 1
    );

    CREATE TABLE IF NOT EXISTS categories (
      catId INTEGER PRIMARY KEY AUTOINCREMENT,
      catName TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      proId INTEGER PRIMARY KEY AUTOINCREMENT,
      proName TEXT NOT NULL,
      price REAL NOT NULL,
      validityMonths INTEGER NOT NULL,
      categoryId INTEGER REFERENCES categories (catId)
    );

    CREATE TABLE IF NOT EXISTS invoices (
      invId INTEGER PRIMARY KEY AUTOINCREMENT,
      costumerId INTEGER REFERENCES costumers (cosId),
      totalValue REAL NOT NULL,
      visitDate TEXT NOT NULL,
      returnDate TEXT NOT NULL,
      realized INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invoice_products (
      invoiceId INTEGER REFERENCES invoices (invId),
      productId INTEGER REFERENCES products (proId),
      quantity INTEGER NOT NULL,
      PRIMARY KEY (invoiceId, productId)
    );
  `)
}
