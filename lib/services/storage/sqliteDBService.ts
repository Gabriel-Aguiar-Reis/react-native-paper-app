import { SQLiteDatabase } from 'expo-sqlite'

export async function initializeDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA foreign_keys = ON;
    
    CREATE TABLE IF NOT EXISTS costumers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      costumerId INTEGER REFERENCES costumers (id) ON DELETE CASCADE,
      street TEXT NOT NULL,
      number INTEGER NOT NULL,
      neighbourhood TEXT NOT NULL,
      city TEXT NOT NULL,
      zipCode TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      costumerId INTEGER REFERENCES costumers (id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      isWhatsapp INTEGER NOT NULL -- 0 or 1
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      validityMonths INTEGER NOT NULL,
      categoryName TEXT REFERENCES categories (name)
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      costumerId INTEGER REFERENCES costumers (id),
      totalValue REAL NOT NULL,
      visitDate TEXT NOT NULL,
      returnDate TEXT NOT NULL,
      realized INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invoice_products (
      invoiceId INTEGER REFERENCES invoices (id) ON DELETE CASCADE,
      productId INTEGER REFERENCES products (id),
      quantity INTEGER NOT NULL,
      PRIMARY KEY (invoiceId, productId)
    );
  `)
}
