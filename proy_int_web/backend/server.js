const WebSocket = require("ws");
const axios = require("axios");

// ========================
// CONFIGURACIÓN
// ========================
const PORT = 3001;
const ESP32_IP = "http://192.168.1.21";  // <-- CAMBIÁ ESTA IP DE TU ESP32

let ledState = false;

// ========================
// SERVIDOR WEBSOCKET
// ========================
const wss = new WebSocket.Server({ port: PORT });

console.log(`[WS] Servidor WebSocket nuevo escuchando en puerto ${PORT}`);

wss.on("connection", (ws) => {
  console.log("[WS] Cliente conectado");

  // Cuando el frontend pide el estado
  ws.on("message", async (msg) => {
    const json = JSON.parse(msg);
    console.log("[WS] Recibido:", json);

    switch (json.type) {
      case "GET_STATUS":
        await syncStatusWithESP32(ws);
        break;

      case "SET_LED":
        await setLedOnESP32(json.data);
        broadcastLedStatus();
        break;

      default:
        ws.send(JSON.stringify({ type: "ERROR", data: "Comando desconocido" }));
    }
  });

  ws.on("close", () => console.log("[WS] Cliente desconectado"));
});

// ========================
// FUNCIONES
// ========================

// 🔄 Sincroniza estado ESP32 → Frontend
async function syncStatusWithESP32(ws) {
  try {
    const res = await axios.get(`${ESP32_IP}/status`);
    ledState = res.data.led; // ESP32 debe responder { led: true/false }

    ws.send(JSON.stringify({
      type: "STATUS",
      data: { led: ledState }
    }));

    console.log("[WS] Estado inicial enviado al cliente:", ledState);

  } catch (error) {
    console.log("❌ Error obteniendo estado del ESP32:", error.message);
    ws.send(JSON.stringify({ type: "STATUS", data: { led: false } }));
  }
}

// 🔥 Cambia el LED del ESP32
async function setLedOnESP32(state) {
  const url = state === "ON" ? "/ON" : "/OFF";

  try {
    await axios.get(`${ESP32_IP}${url}`);
    ledState = state === "ON";
    console.log("[ESP32] LED actualizado a:", ledState);

  } catch (error) {
    console.log("❌ Error enviando comando al ESP32:", error.message);
  }
}

// 📡 Envía el estado a todos los clientes
function broadcastLedStatus() {
  const msg = JSON.stringify({
    type: "LED_UPDATE",
    data: { led: ledState },
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}
