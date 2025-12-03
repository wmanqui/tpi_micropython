//"ws": libreria que permite crear un WebSocket
const WebSocket = require("ws");
const config = require("./config")
const {getFullState} = require("./state");
//const mqttClient = require("./mqttClient");
//const {publishSetLed} = require("./mqttClient");

let wss = null;

function initWebSocket(){
    //Creación de servidor WebSocket
    wss = new WebSocket.Server({ port: config.WS_PORT });
    //Mensaje para indicar que el servidor esta corriendo
    console.log(`[backend] Servidor WebSocket Node escuchando en puerto ${config.WS_PORT}`);
    //Escucha conexiones entrantes
    wss.on("connection", (ws) => {
        console.log("[backend] Cliente conectado");
        //Se ejecuta cuando el cliente se desconecta
        ws.send(JSON.stringify({type:"STATUS", data: getFullState()}))
        ws.on("message",(msg) => onClientMessage(ws,msg));
        ws.on("close", () => console.log("[backend] Cliente desconectado"));
 
    });
};

function onClientMessage(ws,msg){
    const json = JSON.parse(msg);
    console.log("[ws] Recibido:", json);

    switch (json.type) {
        case "GET_STATUS":
            ws.send(JSON.stringify({ type: "STATUS", data: getFullState() }));
            break;
        case "SET_LED":
            const newState = json.value === "ON" ? "ON" : "OFF";
            // delegar a mqtt
            require("./mqttClient").publish("esp32/led/set", newState);
        break;

        default:
            ws.send(JSON.stringify({ type: "ERROR", data: "Comando desconocido" }));
  }

}

/*
//Envía el estado a todos los clientes
function broadcastLedStatus() {
  const msg = JSON.stringify({
    type: "LED_UPDATE",
    data: { led: state.ledState },
  });

  ws.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}
*/

// Notifica a todos los clientes
function broadcastUpdate() {
  const msg = JSON.stringify({ type: "UPDATE", data: getFullState() });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}


module.exports = {
    initWebSocket,
    broadcastUpdate
};



/*

       //Escucha mensajes del cliente
        // //"msg": mensaje recibido en formato de texto
        // //"JSON.parse(msj)": convierte el texto a JSON
        ws.on("message", async (msg) => {
        const json = JSON.parse(msg);
        console.log("[backend] Recibido desde frontend:", json);
        switch(json.type){
            case "GET_STATUS":
                ws.send(JSON.stringify({
                    type: "STATUS",
                    data: {led: state.ledState}
                }));
                console.log("[backend] Estado inicial enviado al frontend:", state.ledState);
                break;
            case "SET_LED":
                const newState = json.data === "ON" ? "ON" : "OFF";
                console.log("[backend] Enviando comando MQTT a broker:",newState);
                //Publica comando en broker
                mqttClient.publishSetLed("esp32/led/set",newState);
                break;
            default:
                ws.send(JSON.stringify({type:"ERROR", data: "Comando desconocido"}))
        }

        */