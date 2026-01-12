const BaseScraper = require('./base');
const cheerio = require('cheerio');

class UCCScraper extends BaseScraper {
    constructor() {
        super('UCC', 'https://www.ucc.com.bd');
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
        } catch (e) { return []; }
    }
}

class LaptopBDScraper extends BaseScraper {
    constructor() {
        super('Laptop BD', 'https://www.laptopbd.com');
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
        } catch (e) { return []; }
    }
}

class PickabooScraper extends BaseScraper {
    constructor() {
        super('Pickaboo', 'https://www.pickaboo.com');
    }
    async search(query) {
        const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}`;
        try {
            // Pickaboo usually needs Puppeteer
            const html = await this.fetchWithPuppeteer(url);
            if (!html) return [];
            const $ = cheerio.load(html);
            const products = [];
            $('.product-item').each((i, el) => {
                const name = $(el).find('.product-item-link').text().trim();
                const productUrl = this.resolveUrl($(el).find('.product-item-link').attr('href'));
                const image = this.resolveUrl($(el).find('.product-image-photo').attr('src'));
                const priceText = $(el).find('.price').text().trim();
                const priceMatch = priceText.match(/(\d+,?)+/);
                const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;
                if (name && price > 0) {
                    products.push({ name, price, seller_name: this.sourceName, stock_status: 'In Stock', url: productUrl, image });
                }
            });
            return products;
        } catch (e) { return []; }
    }
}

class SmartTechScraper extends BaseScraper {
    constructor() {
        super('Smart Technology', 'https://smart-bd.com');
    }
    async search(query) {
        const url = `${this.baseUrl}/search?search=${encodeURIComponent(query)}`;
        try {
            const html = await this.fetchHtml(url);
            if (!html) return [];
            const $ = cheerio.load(html);
            const products = [];
            $('.product-list-item').each((i, el) => {
                const name = $(el).find('.title a').text().trim();
                const productUrl = this.resolveUrl($(el).find('.title a').attr('href'));
                const image = this.resolveUrl($(el).find('.image img').attr('src'));
                const priceText = $(el).find('.price').text().trim();
                const priceMatch = priceText.match(/(\d+,?)+/);
                const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;
                if (name && price > 0) {
                    products.push({ name, price, seller_name: this.sourceName, stock_status: 'In Stock', url: productUrl, image });
                }
            });
            return products;
        } catch (e) { return []; }
    }
}

class DarazScraper extends BaseScraper {
    constructor() {
        super('Daraz', 'https://www.daraz.com.bd');
    }
    async search(query) {
        const url = `${this.baseUrl}/catalog/?q=${encodeURIComponent(query)}`;
        try {
            // Daraz is highly protected, using Puppeteer is a must
            const html = await this.fetchWithPuppeteer(url);
            if (!html) return [];
            const $ = cheerio.load(html);
            const products = [];
            $('.gridItem').each((i, el) => {
                const name = $(el).find('.title--w9993').text().trim();
                const productUrl = this.resolveUrl($(el).find('a').attr('href'));
                const image = this.resolveUrl($(el).find('img').attr('src'));
                const priceText = $(el).find('.price--Wh95y').text().trim();
                const priceMatch = priceText.match(/(\d+,?)+/);
                const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;
                if (name && price > 0) {
                    products.push({ name, price, seller_name: this.sourceName, stock_status: 'In Stock', url: productUrl, image });
                }
            });
            return products;
        } catch (e) { return []; }
    }
}

module.exports = { UCCScraper, LaptopBDScraper, PickabooScraper, SmartTechScraper, DarazScraper };
