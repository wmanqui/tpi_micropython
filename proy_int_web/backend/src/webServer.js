/* ---------------------------------------------------
Este archivo se encarga de:

    1-Crear el servidor WebSocket.
    2-Escuchar cuando el servidor se conecta.
    3-Recibir comandos "GET_STATUS", "SET_LED".
    4-Enviar actualizaciones al frontend.

----------------------------------------------------- */


//"ws": libreria que permite crear un WebSocket
const WebSocket = require("ws");
const config = require("./config")
const {getFullState} = require("./state");
const {mqttEvents, publish} = require("./mqttClient");

let wss = null;


//El mqttClient informa que se genero un cambio
mqttEvents.on("ledUpdate", () => broadcastUpdate());
//mqttEvents.on("sensorUpdate", () => broadcastUpdate());


//Funcionando correctamente
function initWebSocket(){
    //Creación de servidor WebSocket
    wss = new WebSocket.Server({ port: config.WS_PORT });
    //Mensaje para indicar que el servidor esta corriendo
    console.log(`[websocket] Servidor WebSocket Node escuchando en puerto ${config.WS_PORT}`);
    //Escucha conexiones entrantes
    wss.on("connection", (ws) => {
        console.log("[websocket] Cliente conectado");
        //Se ejecuta cuando el cliente se desconecta
        ws.send(JSON.stringify({type:"STATUS", data: getFullState()}))
        ws.on("message",(msg) => onClientMessage(ws,msg));
        ws.on("close", () => console.log("[websocket] Cliente desconectado"));
       
    });
};

//Escucha mensajes del cliente
function onClientMessage(ws,msg){
    //"msg": mensaje recibido en formato de texto
    //"JSON.parse(msj)": convierte el texto a JSON
    const json = JSON.parse(msg);
    console.log("[websocket] Recibido desde frontend:", json);
    switch (json.type) {
        case "GET_STATUS":
            ws.send(JSON.stringify({ type: "STATUS", data: getFullState() }));
            console.log("[websockett] Estado inicial enviado al frontend:", getFullState());
            break;
        case "SET_LED":
            publish(config.TOPICS.SET_LED1, json.data);
            console.log("[websocket] Enviando comando MQTT a broker");
        break;

        default:
            ws.send(JSON.stringify({ type: "ERROR", data: "Comando desconocido" }));
  }

}


// Notifica a todos los clientes
function broadcastUpdate() {
  const msg = JSON.stringify({ 
    type: "UPDATE", 
    data: getFullState(), 
    });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}


module.exports = {
    initWebSocket
};


