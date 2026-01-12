const BaseScraper = require('./base');
const cheerio = require('cheerio');

class StarTechScraper extends BaseScraper {
    constructor() {
        super('Star Tech', 'https://www.startech.com.bd');
    }

    async search(query) {
        const url = `${this.baseUrl}/product/search?search=${encodeURIComponent(query)}`;
        console.log(`Scraping Star Tech: ${url}`);

        try {
            const html = await this.fetchHtml(url);
            if (!html) return [];

            const $ = cheerio.load(html);
            const products = [];

            $('.p-item').each((i, el) => {
                const name = $(el).find('.p-item-name a').text().trim();
                const priceText = $(el).find('.p-item-price span').first().text().trim().replace(/,/g, '');
                const price = parseInt(priceText.replace(/[^\d]/g, ''));
                const image = $(el).find('.p-item-img img').attr('src');
                const productUrl = $(el).find('.p-item-name a').attr('href');

                // Stock status is usually indicated by the button
                // If "Out of Stock" or "Pre Order" text exists in .p-item-price or a badge
                // Usually Star Tech removes buy button if out of stock
                // inspecting: might have .p-item-stock-status
                // We'll trust the price presence or look for specific out of stock markers
                // Assuming In Stock if not explicitly marked otherwise
                const isOutOfStock = $(el).text().toLowerCase().includes('out of stock');
                const stockStatus = isOutOfStock ? 'Out of Stock' : 'In Stock';

                if (name && !isNaN(price)) {
                    products.push({
                        name,
                        price,
                        seller_name: this.sourceName,
                        stock_status: stockStatus,
                        url: productUrl,
                        image: image
                    });
                }
            });

            return products;
        } catch (error) {
            console.error('Star Tech scraping error:', error);
            return [];
        }
    }
}

module.exports = StarTechScraper;
