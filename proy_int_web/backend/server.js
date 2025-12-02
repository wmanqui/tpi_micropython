
/*
//"ws": libreria que permite crear un WebSocket
const WebSocket = require("ws");
//"axios": libreria que permite realizat peticiones http en Node
//const axios = require("axios");

const mqtt = require("mqtt");

//Estado actual del LED
let ledState = false;

//--------Configuración de WebSocket------
//Puerto donde se va a ejucatar el WebSocket
const PORT = 3001;
//Creación de servidor WebSocket
const wss = new WebSocket.Server({ port: PORT });
//Mensaje para indicar que el servidor esta corriendo
console.log(`[backend] Servidor WebSocket Node escuchando en puerto ${PORT}`);
//----------------------------------------

//----Configuracion de HiveMQ Cloud ------
const MQTT_BROKER = "8e9c811d07444d56935a3fd2bd1b0341.s1.eu.hivemq.cloud";  
const MQTT_USER = "walter";
const MQTT_PASSWORD = "Whitealbum1";
const MQTT_PORT = 8883;
//Se realiza conexión con el broker HiveMQ cloud
const client_mqtt = mqtt.connect(`mqtts://${MQTT_BROKER}:${MQTT_PORT}`,{
  username: MQTT_USER,
  password: MQTT_PASSWORD,
});


client_mqtt.on("connect",() =>{
  console.log("[mqtt] Conectado a HiveMQ CLoud");
  //Se suscribe al topico

  client_mqtt.subscribe("esp32/led/status", (err) => {
    if (!err) console.log("[mqtt] Suscripto a esp32/led/Status");
    else console.error("[mqtt] Error al subcribit al topico",err );
  });

  client_mqtt.publish("backend/info","Backend conectado correctamente");
});

//----------------------------------------


//Llega comando desde el broker
client_mqtt.on("message", (topic,message)=>{
  if(topic === "esp32/led/status"){
    ledState = message.toString() === "ON";
    console.log("[mqtt] Estado enviado desde el Broker", ledState);
    //Envia actuañizacón a todos los clientes WebSocket
    broadcastLedStatus();
  }
});


//Escucha conexiones entrantes
wss.on("connection", (ws) => {
  console.log("[backend] Cliente conectado");

  ws.send(JSON.stringify({
    type: "STATUS",
    data: {led: ledState}
  }));

  console.log("[backend] Estado inicial enviado al frontend:", ledState);


 
  //Escucha mensajes del cliente
  //"msg": mensaje recibido en formato de texto
  //"JSON.parse(msj)": convierte el texto a JSON
  ws.on("message", async (msg) => {
    const json = JSON.parse(msg);
    console.log("[backend] Recibido desde frontend:", json);

    switch(json.type){
      case "GET_STATUS":
        ws.send(JSON.stringify({
        type: "STATUS",
        data: {led: ledState}
        }));
        console.log("[backend] Estado inicial enviado al frontend:", ledState);
        break;
      case "SET_LED":
        const newState = json.data === "ON" ? "ON" : "OFF";
        console.log("[backend] Enviando comando MQTT a broker:",newState);
        //Publica comando en broker
        client_mqtt.publish("esp32/led/set",newState);
        break;
      default:
        ws.send(JSON.stringify({type:"ERROR", data: "Comando desconocido"}))
    }
  });
  //Se ejecuta cuando el cliente se desconecta
  ws.on("close", () => console.log("[backend] Cliente desconectado"));
});

//Funciones

//Envía el estado a todos los clientes
function broadcastLedStatus() {
  const msg = JSON.stringify({
    type: "LED_UPDATE",
    data: { led: ledState },
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

*/

const {initMQTT,msjMQTTReception} = require("./src/mqttClient");
const {initWebServer} = require("./src/webServer");
initMQTT();
msjMQTTReception();
initWebServer();
