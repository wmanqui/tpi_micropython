/* ---------------------------------------------------
Este archivo se encarga de:

    1-Guardar en memoria todos los leds(por nombre).

    2-Guardar en memoria todos los sensores(por nombre).

----------------------------------------------------- */


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
    console.log(`[state] Sensor actualizado: ${sensorName}=${value}`)
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
        leds: {
            led1: sensors.caldera ===1,
            led2: sensors.humidificador ===1,
            led3: sensors.ventilador ===1,
            led4: sensors.deshumidificador ===1,
        },
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