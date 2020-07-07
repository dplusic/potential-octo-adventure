# potential-octo-adventure

* Simple proof of concept of reverse tunneling
* `Client` ---> [ `Gateway` <--- `Agent` ] ---> `Server`
  * ---> means: `Connection Initiator` (Outbound) ---> (Inbound) `Port Listener`
  * `Agent` is on the same host as `Server`.
  * This can be used for the scenario with following conditions:
    * The host of `Client` and that of `Server` does not support inbound connection.
    * The host of `Gateway` is not applicable for `Server`. (Hardware, OS, etc.)

## Getting Started

* `node gateway/index.js &`
  * listening for agent on 8081
* `node agent/index.js &`
  * connect to gateway on 8081
  * make gateway to listen on 8080
  * get stream from gateway:8080, and transfer to localhost:8082 
* `node test-web-server/index.js &`
  * listening for arbitrary client on 8082
* `curl localhost:8080`
  * connect to test-web-server via gateway and agent
