const WebSocket = require("ws");
const {PORT} = require("../config/config")
const {handleMessage} = require("./wsHandlers");

function startWebSocketServer(){
    const wss = new WebSocket.Server({port:PORT});
    
    console.log(`[WS] Servidor WebSocket escuchando en puerto ${PORT}`);

    function broadcast(json) {
        const msg = JSON.stringify(json);
        wss.clients.forEach(c =>{
            if(c.readyState === WebSocket.OPEN) c.send(msg);
        });
    }

    wss.on("connection", (ws) => {
        console.log("[WS] Cliente conectado");
        ws.on("message", msg =>
            handleMessage(ws,msg,broadcast)
        );
        ws.on("close", () => {
            console.log("[WS] Cliente desconectado");
        });
    });
}

module.exports = {startWebSocketServer};