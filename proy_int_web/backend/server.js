const {initMQTT} = require("./src/mqttClient");
const {initWebSocket, broadcastUpdate } = require("./src/webServer");

initMQTT( );
initWebSocket();
