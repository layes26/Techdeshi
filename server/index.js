const express = require('express');
const cors = require('cors');
const { db, initDB } = require('./database');
const path = require('path');

// Initialize DB
initDB();

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Serve static files from root
app.use(express.static(path.join(__dirname, '../')));

// API Routes

const scraperManager = require('./scraper_manager');

// Search Products
app.get('/api/search', async (req, res) => {
    const { q } = req.query;
    console.log(`[API] received search request for: "${q}"`);
    if (!q) return res.status(400).json({ error: 'Query parameter required' });

    try {
        // Trigger live scrape (async)
        // For demonstration of "Real Data", we await it to show results immediately
        await scraperManager.searchAll(q);

        // 1. Search in local DB (now populated with fresh data)
        // Multi-word search (AND logic)
        const tokens = q.trim().split(/\s+/).filter(t => t.length > 0);
        let whereClauses = [];
        let params = [];

        tokens.forEach(token => {
            whereClauses.push(`(p.name LIKE ? OR p.brand LIKE ? OR p.category LIKE ?)`);
            params.push(`%${token}%`, `%${token}%`, `%${token}%`);
        });

        const whereSql = whereClauses.length > 0 ? whereClauses.join(' AND ') : '1=1';

        const products = db.prepare(`
            SELECT p.*, 
                   json_group_array(json_object(
                       'seller_name', pr.seller_name, 
                       'price', pr.price, 
                       'stock_status', pr.stock_status,
                       'url', pr.url
                   )) as sellers
            FROM products p
            JOIN prices pr ON p.id = pr.product_id
            WHERE ${whereSql}
            GROUP BY p.id
        `).all(...params);

        // Parse the sellers string back to JSON
        const formattedProducts = products.map(p => {
            const sellers = JSON.parse(p.sellers).filter(s => s.seller_name);
            return {
                ...p,
                sellers
            };
        });

        // Log search
        db.prepare('INSERT INTO search_history (query) VALUES (?)').run(q);

        res.json(formattedProducts);

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Seed Mock Data endpoint (for testing DB)
app.get('/api/seed', (req, res) => {
    const insertProduct = db.prepare('INSERT INTO products (name, category, brand, image) VALUES (?, ?, ?, ?)');
    const insertPrice = db.prepare('INSERT INTO prices (product_id, seller_name, price, stock_status, url) VALUES (?, ?, ?, ?, ?)');

    const seedData = require('../js/data.js').PRODUCTS_DATABASE; // Reusing your mock data structure if transferable, otherwise manual seed

    // Manual seed for now based on what we had
    const sample = {
        name: 'Samsung 980 Pro 1TB NVMe SSD',
        category: 'Storage',
        brand: 'Samsung',
        image: 'https://via.placeholder.com/300x300'
    };

    const info = insertProduct.run(sample.name, sample.category, sample.brand, sample.image);
    const pid = info.lastInsertRowid;

    insertPrice.run(pid, 'Ryans Computers', 12500, 'In Stock', '#');
    insertPrice.run(pid, 'Star Tech', 12800, 'In Stock', '#');

    res.json({ message: 'Seeded sample data' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Keep process alive
setInterval(() => { }, 1000);

process.on('exit', (code) => {
    console.log(`Process exiting with code: ${code}`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
