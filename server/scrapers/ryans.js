const BaseScraper = require('./base');
const cheerio = require('cheerio');

class RyansScraper extends BaseScraper {
    constructor() {
        super('Ryans Computers', 'https://www.ryanscomputers.com');
    }

    async search(query) {
        const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}`;
        console.log(`Scraping Ryans: ${url}`);

        try {
            // Ryans blocks axios, use Puppeteer
            const html = await this.fetchWithPuppeteer(url);
            if (!html) return [];

            const $ = cheerio.load(html);
            const products = [];

            // Ryans uses .card for products on search results
            let cards = $('.card');

            cards.each((i, el) => {
                // Title
                let name = $(el).find('.product-title a').text().trim();
                // If not found, try h4
                if (!name) name = $(el).find('h4 a').text().trim();

                // URL
                let urlSuffix = $(el).find('.product-title a').attr('href') || $(el).find('a').first().attr('href');
                const productUrl = this.resolveUrl(urlSuffix);

                // Price
                let priceText = $(el).find('.pr-text').text().trim() || $(el).find('.price').text().trim();
                const price = parseInt(priceText.replace(/[^\d]/g, ''));

                // Image
                const img = $(el).find('.image-box img');
                let imageSrc = img.attr('data-src') || img.attr('data-original') || img.attr('src') || $(el).find('img').first().attr('src');

                // If it's a placeholder, try to find another img or just use empty
                if (imageSrc && (imageSrc.includes('placeholder') || imageSrc.includes('loading'))) {
                    const fallbackImg = $(el).find('img').not(img).first();
                    if (fallbackImg.length) {
                        imageSrc = fallbackImg.attr('data-src') || fallbackImg.attr('src');
                    }
                }
                const image = this.resolveUrl(imageSrc);

                // Stock Check
                const hasCartBtn = $(el).find('.cart-btn').length > 0 || $(el).text().toLowerCase().includes('in stock');
                const stockStatus = hasCartBtn ? 'In Stock' : 'Out of Stock';

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
            console.error('Ryans scraping error:', error);
            return [];
        }
    }
}

module.exports = RyansScraper;
