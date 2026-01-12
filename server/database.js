const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'techdeshi.db');
const db = new Database(dbPath);

// Initialize Database Schema
function initDB() {
    // Products table
    db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            brand TEXT,
            image TEXT,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Prices table (one product can have multiple sellers)
    db.exec(`
        CREATE TABLE IF NOT EXISTS prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            seller_name TEXT NOT NULL,
            price REAL NOT NULL,
            currency TEXT DEFAULT 'BDT',
            stock_status TEXT, -- 'In Stock', 'Out of Stock'
            url TEXT,
            FOREIGN KEY(product_id) REFERENCES products(id)
        )
    `);

    // Search History table
    db.exec(`
        CREATE TABLE IF NOT EXISTS search_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Database initialized at ' + dbPath);
}

module.exports = {
    db,
    initDB
};
