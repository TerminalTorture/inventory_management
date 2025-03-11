import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows frontend to access backend
app.use(bodyParser.json()); // Parse JSON request bodies

// 🟢 GET: Fetch all inventory items
app.get('/inventory', (req, res) => {
    db.all("SELECT * FROM inventory", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// 🟢 GET: Fetch a single item by ID
app.get('/inventory/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM inventory WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

// 🟢 POST: Add a new inventory item with cabinet_id
app.post('/inventory', (req, res) => {
    const { name, category, quantity, unit_price, cabinet_id } = req.body;

    if (!name || !quantity || !cabinet_id) {
        res.status(400).json({ error: "Name, quantity, and cabinet_id are required." });
        return;
    }

    db.run(
        `INSERT INTO inventory (name, category, quantity, unit_price, cabinet_id) VALUES (?, ?, ?, ?, ?)`,
        [name, category, quantity, unit_price, cabinet_id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, name, category, quantity, unit_price, cabinet_id });
        }
    );
});

// 🟢 PUT: Update an existing inventory item with cabinet_id
app.put('/inventory/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, quantity, unit_price, cabinet_id } = req.body;

    db.run(
        `UPDATE inventory SET name = ?, category = ?, quantity = ?, unit_price = ?, cabinet_id = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?`,
        [name, category, quantity, unit_price, cabinet_id, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: "Item updated successfully" });
        }
    );
});

// 🟢 DELETE: Remove an inventory item
app.delete('/inventory/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM inventory WHERE id = ?`, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Item deleted successfully" });
    });
});

// 🟢 GET: Fetch all cabinets
app.get('/cabinets', (req, res) => {
    db.all("SELECT * FROM cabinets", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// 🟢 POST: Add a new cabinet
app.post('/cabinets', (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).json({ error: "Name is required." });
        return;
    }

    db.run(
        `INSERT INTO cabinets (name) VALUES (?)`,
        [name],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, name });
        }
    );
});

// 🟢 GET: Fetch all inventory items by cabinet
app.get('/cabinets/:id/inventory', (req, res) => {
    const { id } = req.params;
    db.all("SELECT * FROM inventory WHERE cabinet_id = ?", [id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
