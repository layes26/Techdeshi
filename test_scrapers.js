const scraperManager = require('./server/scraper_manager');
const fs = require('fs');
const util = require('util');

const logFile = fs.createWriteStream('debug_log.txt', { flags: 'w' });
const logStdout = process.stdout;

console.log = function (d) { //
    logFile.write(util.format(d) + '\n');
    logStdout.write(util.format(d) + '\n');
};

console.error = function (d) { //
    logFile.write(util.format(d) + '\n');
    logStdout.write(util.format(d) + '\n');
};

async function test() {
    console.log('Testing scrapers...');
    try {
        const results = await scraperManager.searchAll('monitor');
        console.log('Results found: ' + results.length);
        if (results.length > 0) {
            // Count per seller
            const counts = {};
            results.forEach(r => {
                counts[r.seller_name] = (counts[r.seller_name] || 0) + 1;
            });
            console.log('Counts per seller:', JSON.stringify(counts, null, 2));
        } else {
            console.log('No results found. Scrapers might be broken.');
        }
    } catch (err) {
        console.error('Error testing scrapers: ' + err.stack);
    }
}

test();
