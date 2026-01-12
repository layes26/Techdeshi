const StarTechScraper = require('./scrapers/startech');
const RyansScraper = require('./scrapers/ryans');
const { TechLandScraper, GlobalBrandScraper, ComputerVillageScraper } = require('./scrapers/batch1');
const { SkylandScraper, UltraTechScraper, ITManiaScraper } = require('./scrapers/batch2');
const { UCCScraper, LaptopBDScraper, PickabooScraper, SmartTechScraper, DarazScraper } = require('./scrapers/batch3');
const { db } = require('./database');

class ScraperManager {
    constructor() {
        this.scrapers = [
            new StarTechScraper(),
            new RyansScraper(),
            new TechLandScraper(),
            new GlobalBrandScraper(),
            new ComputerVillageScraper(),
            new SkylandScraper(),
            new UltraTechScraper(),
            new ITManiaScraper(),
            new UCCScraper(),
            new LaptopBDScraper(),
            new PickabooScraper(),
            new SmartTechScraper(),
            new DarazScraper()
        ];
    }

    async searchAll(query) {
        console.log(`Starting scrapers for: "${query}"`);

        // Run scrapers in parallel with error handling
        const results = await Promise.all(
            this.scrapers.map(async (scraper) => {
                try {
                    return await scraper.search(query);
                } catch (err) {
                    console.error(`Scraper failed for ${scraper.sourceName}:`, err.message);
                    return [];
                }
            })
        );

        // Flatten results
        const allProducts = results.flat();
        console.log(`Found ${allProducts.length} total products from scrapes.`);

        // Process and Save to DB
        this.saveResults(allProducts);

        return allProducts;
    }

    saveResults(scrapedProducts) {
        const insertProduct = db.prepare(`
            INSERT INTO products (name, category, brand, image) 
            VALUES (?, 'Unknown', ?, ?)
        `);

        // Check if product exists (simple name matching for now)
        const findProduct = db.prepare('SELECT id FROM products WHERE name = ?');

        const insertPrice = db.prepare(`
            INSERT INTO prices (product_id, seller_name, price, stock_status, url)
            VALUES (?, ?, ?, ?, ?)
        `);

        const checkPrice = db.prepare('SELECT id FROM prices WHERE product_id = ? AND seller_name = ?');
        const updatePrice = db.prepare('UPDATE prices SET price = ?, stock_status = ?, url = ? WHERE id = ?');

        // Use transaction for speed
        const transaction = db.transaction(() => {
            for (const p of scrapedProducts) {
                try {
                    let pid;
                    const existing = findProduct.get(p.name);

                    if (existing) {
                        pid = existing.id;
                    } else {
                        const brand = p.name.split(' ')[0];
                        const info = insertProduct.run(p.name, brand, p.image || '');
                        pid = info.lastInsertRowid;
                    }

                    // Update Price
                    const existingPrice = checkPrice.get(pid, p.seller_name);
                    if (existingPrice) {
                        updatePrice.run(p.price, p.stock_status, p.url, existingPrice.id);
                    } else {
                        insertPrice.run(pid, p.seller_name, p.price, p.stock_status, p.url);
                    }
                } catch (err) {
                    console.error('Error saving product:', err.message);
                }
            }
        });

        transaction();
    }
}

module.exports = new ScraperManager();
