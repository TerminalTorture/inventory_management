import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new database connection
const db = new sqlite3.Database(join(__dirname, 'inventory.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create Inventory Table
db.run(`
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
db.run(`
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

// Create Cabinets Table
db.run(`
    CREATE TABLE IF NOT EXISTS cabinets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
`);

// Update Inventory Table to include cabinet_id
db.run(`
    ALTER TABLE inventory ADD COLUMN cabinet_id INTEGER REFERENCES cabinets(id)
`);

// Define the getInventory function
export const getInventory = (callback) => {
    db.all("SELECT * FROM inventory", (err, rows) => {
        if (err) {
            console.error("Error retrieving inventory:", err.message);
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};

// Export database connection
export default db;
