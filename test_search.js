const axios = require('axios');

async function testSearch() {
    console.log('Testing improved search logic...');
    try {
        const query = 'samsung monitor';
        console.log(`Searching for: "${query}"`);
        const response = await axios.get(`http://localhost:3002/api/search?q=${encodeURIComponent(query)}`);
        const results = response.data;

        console.log(`Found ${results.length} results.`);

        const allMatch = results.every(p => {
            const name = p.name.toLowerCase();
            return name.includes('samsung') && name.includes('monitor');
        });

        console.log('Each result contains both "samsung" and "monitor":', allMatch);
        if (!allMatch) {
            results.slice(0, 3).forEach(p => console.log(' - ', p.name));
        }
    } catch (err) {
        console.error('Search test failed:', err.message);
    }
}

testSearch();
