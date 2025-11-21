const {toggleLed, getLedStatus} = require("../services/esp32Service");

async function processLedCommand(action) {
    if(action!== "ON" && action !== "OFF")
        throw new Error("Comando LED invalido");
    
    const newState = await toggleLed(action);
    return{led:newState};
}

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