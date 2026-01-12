const scraperManager = require('./server/scraper_manager');

async function checkRyans() {
    console.log('Checking Ryans images...');
    const ryans = scraperManager.scrapers.find(s => s.sourceName === 'Ryans Computers');
    const results = await ryans.search('monitor');
    console.log(`Found ${results.length} results from Ryans.`);
    if (results.length > 0) {
        console.log('Sample Image URL:', results[0].image);
    }
}

checkRyans();
