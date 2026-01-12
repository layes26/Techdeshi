const BaseScraper = require('./base');
const cheerio = require('cheerio');

class TechLandScraper extends BaseScraper {
    constructor() {
        super('Tech Land BD', 'https://www.techlandbd.com');
    }

    async search(query) {
        // TechLand search URL pattern
        const url = `${this.baseUrl}/index.php?route=product/search&search=${encodeURIComponent(query)}`;
        console.log(`Scraping TechLand: ${url}`);

        try {
            const html = await this.fetchHtml(url);
            if (!html) return [];

            const $ = cheerio.load(html);
            const products = [];

            // TechLand uses standard OpenCart grid
            $('.product-layout').each((i, el) => {
                const name = $(el).find('.name a').text().trim();
                const productUrl = this.resolveUrl($(el).find('.name a').attr('href'));
                const image = this.resolveUrl($(el).find('.image img').attr('src'));

                let priceText = $(el).find('.price').text().trim();
                // Sometimes price has "Ex Tax" part, split usually works
                // Extract digits
                const priceMatch = priceText.match(/(\d+,?)+/);
                const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;

                // Stock status is usually in a label or description, but often hidden on search page
                // We'll assume In Stock if price > 0, unless explicitly "Out Of Stock" badge
                const isOutOfStock = $(el).find('.out-of-stock').length > 0;
                const stockStatus = isOutOfStock ? 'Out of Stock' : 'In Stock';

                if (name && price > 0) {
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
            console.error('TechLand scraping error:', error.message);
            return [];
        }
    }
}

class GlobalBrandScraper extends BaseScraper {
    constructor() {
        super('Global Brand', 'https://www.globalbrand.com.bd');
    }

    async search(query) {
        const url = `${this.baseUrl}/index.php?route=product/search&search=${encodeURIComponent(query)}`;
        console.log(`Scraping Global Brand: ${url}`);

        try {
            const html = await this.fetchHtml(url);
            if (!html) return [];

            const $ = cheerio.load(html);
            const products = [];

            $('.product-layout').each((i, el) => {
                const name = $(el).find('.caption h4 a').text().trim();
                const productUrl = this.resolveUrl($(el).find('.caption h4 a').attr('href'));
                const image = this.resolveUrl($(el).find('.image img').attr('src'));

                const priceText = $(el).find('.price-new').text().trim() || $(el).find('.price').text().trim();
                const priceMatch = priceText.match(/(\d+,?)+/);
                const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;

                if (name && price > 0) {
                    products.push({
                        name,
                        price,
                        seller_name: this.sourceName,
                        stock_status: 'In Stock', // Global Brand doesn't clearly show stock on search usually
                        url: productUrl,
                        image: image
                    });
                }
            });

            return products;
        } catch (error) {
            console.error('Global Brand scraping error:', error.message);
            return [];
        }
    }
}

class ComputerVillageScraper extends BaseScraper {
    constructor() {
        super('Computer Village', 'https://www.computervillage.com.bd');
    }

    async search(query) {
        const url = `${this.baseUrl}/index.php?route=product/search&search=${encodeURIComponent(query)}`;
        console.log(`Scraping Computer Village: ${url}`);

        try {
            const html = await this.fetchHtml(url);
            if (!html) return [];

            const $ = cheerio.load(html);
            const products = [];

            // Computer Village usually uses .product-item or similar
            // Assuming generic structure based on their likely CMS

            // Selector structure might vary, attempting standard
            $('.product-item').each((i, el) => {
                const name = $(el).find('.product-name a').text().trim();
                const productUrl = this.resolveUrl($(el).find('.product-name a').attr('href'));
                const image = this.resolveUrl($(el).find('.product-image img').attr('src'));

                const priceText = $(el).find('.price').text().trim();
                const priceMatch = priceText.match(/(\d+,?)+/);
                const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;

                const stockStatus = 'In Stock';

                if (name && price > 0) {
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
            console.error('Computer Village scraping error:', error.message);
            return [];
        }
    }
}

module.exports = {
    TechLandScraper,
    GlobalBrandScraper,
    ComputerVillageScraper
};
