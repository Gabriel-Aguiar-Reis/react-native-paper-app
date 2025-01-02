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
      costumer_id INTEGER REFERENCES costumers (id) ON DELETE CASCADE,
      street TEXT NOT NULL,
      number INTEGER NOT NULL,
      neighbourhood TEXT NOT NULL,
      city TEXT NOT NULL,
      CEP TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      costumer_id INTEGER REFERENCES costumers (id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      isWhatsapp INTEGER NOT NULL -- 0 or 1
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      validity_months INTEGER NOT NULL,
      category_id INTEGER REFERENCES categories (id)
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      costumer_id INTEGER REFERENCES costumers (id),
      total_value REAL NOT NULL,
      visit_date TEXT NOT NULL,
      return_date TEXT NOT NULL,
      realized INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invoice_products (
      invoice_id INTEGER REFERENCES invoices (id),
      product_id INTEGER REFERENCES products (id),
      quantity INTEGER NOT NULL,
      PRIMARY KEY (invoice_id, product_id)
    );
  `)
}
