const axios = require("axios")
const{ESP32_IP} = require("../config");

let ledState = false;


async function toogleled(state) {
    try{
        const url = `${ESP32_IP}/${state}`;
        await axios.get(url);

        ledState = state === "ON";
        return ledState;
    }catch(err){
        console.log("Error", err.message);
        throw err;
    } 
}

function getLedStatus(){
    return ledState;
}

module.exports = {
    toogleled, 
    getLedStatus
    
};