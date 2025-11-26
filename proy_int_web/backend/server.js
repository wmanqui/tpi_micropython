//"ws": libreria que permite crear un WebSocket
const WebSocket = require("ws");
//"axios": libreria que permite realizat peticiones http en Node
const axios = require("axios");

//Puerto donde se va a ejucatar el WebSocket
const PORT = 3001;
//Dirección de IP del esp32 en la red local
const ESP32_IP = "http://192.168.0.108";  

let ledState = false;

//Creación de servidor WebSocket
const wss = new WebSocket.Server({ port: PORT });

console.log(`[backend] Servidor WebSocket Node escuchando en puerto ${PORT}`);

//Escucha conexiones entrantes
wss.on("connection", (ws) => {
  console.log("[backend] Cliente conectado");

  //Escucha mensajes del cliente
  //"msg": mensaje recibido en formato de texto
  //"JSON.parse(msj)": convierte el texto a JSON
  ws.on("message", async (msg) => {
    const json = JSON.parse(msg);
    console.log("[backend] Recibido desde frontend:", json);

    switch (json.type) {
      //El cliente pide el estado actual del led
      case "GET_STATUS":
        //El servidor se lo pide al esp32
        await syncStatusWithESP32(ws);
        break;
      //El cliente quiere cambiar el estado del led
      case "SET_LED":
        //El servidor lo setea en el esp32
        await setLedOnESP32(json.data);
        broadcastLedStatus();
        break;
      //Si llega un mensaje desconocido se lo notifica al cliente
      default:
        ws.send(JSON.stringify({ type: "ERROR", data: "Comando desconocido" }));
    }
  });
  //Se ejecuta cuando el cliente se desconecta
  ws.on("close", () => console.log("[backend] Cliente desconectado"));
});

//Funciones

//Sincroniza estado ESP32 - Frontend
async function syncStatusWithESP32(ws) {
  try {
    const res = await axios.get(`${ESP32_IP}/status`);
    ledState = res.data.led; // ESP32 debe responder { led: true/false }

    ws.send(JSON.stringify({
      type: "STATUS",
      data: { led: ledState }
    }));

    console.log("[backend] Estado inicial enviado al frontend:", ledState);

  } catch (error) {
    console.log("Error obteniendo estado del ESP32:", error.message);
    ws.send(JSON.stringify({ type: "STATUS", data: { led: false } }));
  }
}

//Cambia el LED del ESP32
async function setLedOnESP32(state) {
  const url = state === "ON" ? "/ON" : "/OFF";

  try {
    const res = await axios.get(`${ESP32_IP}${url}`);
    ledState = res.data.led;
    console.log("[ESP32] LED actualizado a:", ledState);

  } catch (error) {
    console.log("Error enviando comando al ESP32:", error.message);
  }
}

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
