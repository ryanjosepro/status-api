const server = require('./server');

server(3030, () => {
    console.log('Running on http://localhost:' + port);
});