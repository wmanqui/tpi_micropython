const {toggleLed, getLedStatus} = require("../services/esp32Service");

//Recibe un comando del frontend por WebSocket
async function processLedCommand(action) {
    if(action!== "ON" && action !== "OFF")
        throw new Error("Comando LED invalido");
    //Envia la orden al esp32
    const newState = await toggleLed(action);
    return{led:newState};
}
//Devuelve el estado actual de todos los dispositivos
function getFullStatus(){
    return{
        led: getLedStatus(),
        timestamp: Date.now(),
    };
}

module.exports = {
    processLedCommand,
    getFullStatus
};