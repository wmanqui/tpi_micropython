//Servidor WebSocket y sus manejadores

const {processLedCommand, getFullStatus} = require("../controllers/devicesController");

async function handleMessage(ws, msg, broadcast) {
    const json = JSON.parse(msg);

    switch(json.type){
        case "GET_STATUS":
            ws.send(JSON.stringify({
                type: "STATUS",
                data: getFullStatus()
            }));
            break;
        case "SET_LED":
            const result = await processLedCommand(json.data);
            broadcast({
                type: "LED_UPDATE",
                data: result
            });
            break;
        default:
            ws.send(JSON.stringify({
                type: "ERROR",
                data: "Comando desconocido"
            }));
    }
}

module.exports = {handleMessage};