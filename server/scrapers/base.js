const axios = require('axios');
const urlModule = require('url');

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

class BaseScraper {
    constructor(sourceName, baseUrl) {
        this.sourceName = sourceName;
        this.baseUrl = baseUrl;
    }

    getRandomUA() {
        return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    }

    resolveUrl(relativeUrl) {
        if (!relativeUrl) return '';
        if (relativeUrl.startsWith('http')) return relativeUrl;
        return new urlModule.URL(relativeUrl, this.baseUrl).toString();
    }

    async fetchHtml(url, config = {}, retries = 2) {
        try {
            const { timeout = 15000, ...customHeaders } = config;

            const headers = {
                'User-Agent': this.getRandomUA(),
                'Referer': this.baseUrl,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                ...customHeaders
            };

            const response = await axios.get(url, {
                headers,
                timeout
            });
            return response.data;
        } catch (error) {
            const status = error.response ? error.response.status : 'N/A';
            const msg = error.message;

            if (retries > 0) {
                console.log(`Retrying ${this.sourceName} (${retries} left) - Error: ${msg} (${status})`);
                await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000)); // Random delay
                return this.fetchHtml(url, config, retries - 1);
            }

            console.error(`Failed to fetch ${url} after retries: ${msg} (${status})`);
            return null;
        }
    }

    async fetchWithPuppeteer(url) {
        console.log(`[Puppeteer] Launching for ${this.sourceName}...`);
        let browser = null;
        try {
            // Lazy load puppeteer
            const puppeteer = require('puppeteer');
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();

            // Set User Agent
            await page.setUserAgent(this.getRandomUA());

            // Go to URL
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // Wait for body
            await page.waitForSelector('body');

            const content = await page.content();
            await browser.close();
            return content;
        } catch (error) {
            console.error(`[Puppeteer] Error fetching ${url}:`, error.message);
            if (browser) await browser.close();
            return null;
        }
    }

    // To be implemented by children
    async search(query) {
        throw new Error('Method not implemented');
    }
}

module.exports = BaseScraper;
