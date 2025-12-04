//Maneja los leds y sensores

let leds = {};
let sensors = {};

//Actualiza el estado del LED
function setLed(ledName, value) {
    if (typeof ledName !== "string"){
        console.warn(`[state] ledName debe ser un string`);
        return;
    }
    leds[ledName] = value;
    console.log(`[state] LED actualizado: ${ledName}=${value}`)
}

//Actualiza el estado del Sensor
function setSensor(sensorName, value) {
    if (typeof sensorName !== "string"){
        console.warn(`[state] sensorName debe ser un string`);
        return;
    }
    sensors[sensorName] = value;
    console.log(`[state] Sesnsor actualizado: ${sensorName}=${value}`)
}

function getLed(ledName){
    return leds[ledName];
}
function getAllLeds(){
    return {...leds};
}

function getSensor(sensorName){
    return sensors[sensorName];
}
function getAllSensors(){
    return {...sensors};
}


function getFullState(){
    return{
        leds: {...leds},
        sensors: {...sensors},
    }
}


module.exports = {
    setLed,
    setSensor,
    getLed,
    getAllLeds,
    getSensor,
    getFullState,
    getAllSensors,
};