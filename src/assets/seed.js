import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Create and connect to the SQLite database
const db = await open({
    filename: './inventory.db',
    driver: sqlite3.Database
});

// Create Inventory Table
await db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        quantity INTEGER NOT NULL,
        unit_price REAL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

// Create Transactions Table
await db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        transaction_type TEXT NOT NULL,
        quantity_change INTEGER NOT NULL,
        performed_by TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES inventory(id)
    )
`);

// Insert Sample Data
await db.exec(`
    INSERT INTO inventory (name, category, quantity, unit_price) VALUES 
    ('Laptop', 'Electronics', 10, 999.99),
    ('Mouse', 'Electronics', 50, 19.99),
    ('Keyboard', 'Electronics', 30, 49.99)
`);

await db.exec(`
    INSERT INTO transactions (item_id, transaction_type, quantity_change, performed_by) VALUES 
    (1, 'Added', 10, 'Admin'),
    (2, 'Added', 50, 'Admin'),
    (3, 'Added', 30, 'Admin')
`);

console.log('Database initialized with sample data.');
await db.close();
