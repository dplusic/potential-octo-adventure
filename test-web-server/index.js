const process = require('process');
const http = require('http');

const webServerPort = 8082

http.createServer((req, res) => {
  res.write('Hello World!');
  res.end();
}).listen(webServerPort);
