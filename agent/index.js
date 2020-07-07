const net = require('net');

const gatewayHost = 'localhost'
const gatewayPort = 8081;
const agentId = 'main';

const client = new net.Socket();

client.connect(gatewayPort, gatewayHost, () => {
  console.log('Connected');
  client.write(`c:${agentId}\n`);
});

client.on('data', data => {
  const [connId, portStr] = data.toString().trim().split(':')
  const port = parseInt(portStr)

  const tunnel = new net.Socket();
  tunnel.connect(gatewayPort, gatewayHost, () => {
    console.log(`Tunnel established: ${connId}:${port}`);

    tunnel.write(`t:${connId}\n`);

    const target = new net.Socket();
    target.connect(port, 'localhost', () => {
      target.pipe(tunnel)
      tunnel.pipe(target)
    })
  });
});
