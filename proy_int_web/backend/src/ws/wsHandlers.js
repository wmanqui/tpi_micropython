//Servidor WebSocket y sus manejadores
//Ejecuta una acción deacuerdo al comando recibido

const {processLedCommand, getFullStatus} = require("../controllers/devicesController");

async function handleMessage(ws, msg, broadcast) {
    const json = JSON.parse(msg);

    switch(json.type){
        //El cliente pide el estado del sistema
        case "GET_STATUS":
            ws.send(JSON.stringify({
                type: "STATUS",
                data: getFullStatus()
            }));
            break;
        //El cliente pide apagar y encender el LED(cambia el LED en el esp32)    
        case "SET_LED":
            const result = await processLedCommand(json.data);
            //Envia el cambio a todos los clientes conectados
            broadcast({
                type: "LED_UPDATE",
                data: result
            });
            break;
        //Comando desconocido    
        default:
            ws.send(JSON.stringify({
                type: "ERROR",
                data: "Comando desconocido"
            }));
    }
}

module.exports = {handleMessage};