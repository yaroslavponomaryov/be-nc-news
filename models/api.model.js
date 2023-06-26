const fs = require('fs/promises');
exports.fetchAllEndpoints = () => {

    return fs.readFile('./endpoints.json', 'utf-8')
        .then((endpoints) => {
            return JSON.parse(endpoints);
        });
};