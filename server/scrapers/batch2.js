const BaseScraper = require('./base');
const cheerio = require('cheerio');

class SkylandScraper extends BaseScraper {
    constructor() {
        super('Skyland', 'https://www.skyland.com.bd');
    }

    async search(query) {
        const url = `${this.baseUrl}/index.php?route=product/search&search=${encodeURIComponent(query)}`;
        try {
            const html = await this.fetchHtml(url);
            if (!html) return [];
            const $ = cheerio.load(html);
            const products = [];
            $('.product-layout').each((i, el) => {
                const name = $(el).find('.name a').text().trim();
                const productUrl = this.resolveUrl($(el).find('.name a').attr('href'));
                const image = this.resolveUrl($(el).find('.image img').attr('src'));
                const priceText = $(el).find('.price').text().trim();
                const priceMatch = priceText.match(/(\d+,?)+/);
                const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;
                if (name && price > 0) {
                    products.push({ name, price, seller_name: this.sourceName, stock_status: 'In Stock', url: productUrl, image });
                }
            });
            return products;
        } catch (e) { console.error('Skyland error:', e.message); return []; }
    }
}

class UltraTechScraper extends BaseScraper {
    constructor() {
        super('Ultra Technology', 'https://www.ultratech.com.bd');
    }

    async search(query) {
        const url = `${this.baseUrl}/index.php?route=product/search&search=${encodeURIComponent(query)}`;
        try {
            const html = await this.fetchHtml(url);
            if (!html) return [];
            const $ = cheerio.load(html);
            const products = [];
            $('.product-layout').each((i, el) => {
                const name = $(el).find('.name a').text().trim();
                const productUrl = this.resolveUrl($(el).find('.name a').attr('href'));
                const image = this.resolveUrl($(el).find('.image img').attr('src'));
                const priceText = $(el).find('.price').text().trim();
                const priceMatch = priceText.match(/(\d+,?)+/);
                const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;
                if (name && price > 0) {
                    products.push({ name, price, seller_name: this.sourceName, stock_status: 'In Stock', url: productUrl, image });
                }
            });
            return products;
        } catch (e) { console.error('Ultra Tech error:', e.message); return []; }
    }
}

class ITManiaScraper extends BaseScraper {
    constructor() {
        super('Computer Mania BD', 'https://www.computermania.com.bd');
    }

    async search(query) {
        // Computer Mania BD search
        const url = `${this.baseUrl}/?s=${encodeURIComponent(query)}&post_type=product`;
        try {
            // CM also has strong protection often
            const html = await this.fetchWithPuppeteer(url);
            if (!html) return [];
            const $ = cheerio.load(html);
            const products = [];
            $('.product').each((i, el) => {
                const name = $(el).find('.woocommerce-loop-product__title').text().trim();
                const productUrl = this.resolveUrl($(el).find('.woocommerce-loop-product__link').attr('href'));
                const image = this.resolveUrl($(el).find('img').attr('src'));
                const priceText = $(el).find('.price .amount').last().text().trim(); // last() for sale price
                const priceMatch = priceText.match(/(\d+,?)+/);
                const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;
                if (name && price > 0) {
                    products.push({ name, price, seller_name: this.sourceName, stock_status: 'In Stock', url: productUrl, image });
                }
            });
            return products;
        } catch (e) { console.error('IT Mania error:', e.message); return []; }
    }
}

module.exports = { SkylandScraper, UltraTechScraper, ITManiaScraper };
