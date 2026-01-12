const { db } = require('./server/database');

const products = db.prepare('SELECT * FROM products').all();
console.log(`Total products: ${products.length}`);
if (products.length > 0) {
    console.log('Sample product:', products[0]);
    const prices = db.prepare('SELECT * FROM prices WHERE product_id = ?').all(products[0].id);
    console.log('Prices for sample:', prices);
}

const history = db.prepare('SELECT * FROM search_history').all();
console.log('Search history:', history);
