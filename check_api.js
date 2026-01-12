const http = require('http');

const url = 'http://localhost:3002/api/search?q=ssd';

http.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Status Code:', res.statusCode);
            console.log('Results count:', json.length);
            if (json.length > 0) {
                console.log('First item:', JSON.stringify(json[0], null, 2));
            } else {
                console.log('No results.');
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log('Raw data:', data);
        }
    });

}).on('error', (err) => {
    console.error('Error fetching API:', err);
});
