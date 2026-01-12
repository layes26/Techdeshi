const { UCCScraper } = require('./server/scrapers/batch3');

async function testUCC() {
    console.log('Testing UCC scraper...');
    const scraper = new UCCScraper();
    try {
        const results = await scraper.search('monitor');
        console.log(`Found ${results.length} results.`);
        console.log(JSON.stringify(results, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testUCC();
