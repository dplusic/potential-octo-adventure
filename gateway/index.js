const net = require('net');

const agentServerPort = 8081;
const agentServer = net.createServer(socket => {

  let agentId;
  socket.on('error', (err) => {
    console.log(`error ${err}`)
    socket.destroy()
    deregisterAgent(agentId)
  })

  const handleHeader = (data) => {
    const [flag, param] = data.toString().trim().split(':')

    if (flag === 'c') {
      agentId = param
      registerAgent(agentId, socket)
      socket.removeListener('data', handleHeader)

    } else if (flag === 't') {
      handleAgentTunnel(param, socket)
      socket.removeListener('data', handleHeader)

    } else {
      socket.destroy()
    }
  }
  socket.on('data', handleHeader)
});
agentServer.listen(agentServerPort, '0.0.0.0');

const portMap = {
  'main': [
    [8080, 8082],
  ],
}

const agents = {}
const clientSockets = {}

const registerAgent = (agentId, agentSocket) => {
  console.log(`register agent: ${agentId}`)

  const servers = portMap[agentId].map(([listenPort, targetPort]) =>
      net.createServer(clientSocket => {
        const connId = Math.random().toString(36).substring(2)
        createTunnel(agentSocket, connId, targetPort, clientSocket)
      }).listen(listenPort, '0.0.0.0'))

  agents[agentId] = {
    socket: agentSocket,
    servers,
  }
}

const deregisterAgent = (agentId) => {
  console.log(`deregister agent: ${agentId}`)

  const agent = agents[agentId]
  agent.socket.destroy()
  agent.servers.forEach(server => server.close())

  delete agents[agentId]
}

const createTunnel = (agentSocket, connId, port, clientSocket) => {
  agentSocket.write(`${connId}:${port}\n`)

  clientSockets[connId] = clientSocket
}

const handleAgentTunnel = (connId, socket) => {
  const clientSocket = clientSockets[connId]

  socket.pipe(clientSocket)
  clientSocket.pipe(socket)

  delete clientSockets[connId]

  console.log(`Tunnel established: ${connId}`)
}
