//Maneja los leds y sensores

const state = {
    leds: {
        led1: false,
        led2: false
    },
    sensors: {
        puerta: false,
        ventana: false
    }
};

function setLed(name, value) {
    state.leds[name] = value;
}

function getLed(name){
    return state.leds[name];
}

function getFullState(){
    return state;
}

module.exports = {
    state,
    setLed,
    getLed,
    getFullState
};