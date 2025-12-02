const mqtt = require("mqtt");
const config = require("./config")
const state = require("./state");
//const {broadcastLedStatus} = require("./webServer");


let client_mqtt;

function initMQTT(){
    client_mqtt = mqtt.connect(`mqtts://${config.MQTT.BROKER}:${config.MQTT.PORT}`,{
        username: config.MQTT.USER,
        password: config.MQTT.PASSWORD,
    });
    //Realiza la conexiòn con el broker HiveMQ Client
    client_mqtt.on("connect",() =>{
        console.log("[mqtt] Conectado a HiveMQ CLoud");
        //Se suscribe al topico 
        client_mqtt.subscribe(config.TOPICS.LED_STATUS, (err) => {
            if (!err) console.log("[mqtt] Suscripto a", config.TOPICS.LED_STATUS);
            else console.error("[mqtt] Error al subcribit a ", config.TOPICS.LED_STATUS,err );
        });
        client_mqtt.publish(config.TOPICS.BACKEND_INFO,"Backend conectado correctamente");
  });
}

function msjMQTTReception(){
    client_mqtt.on("message", (topic,message)=>{
        if(topic === config.TOPICS.LED_STATUS){
            ledState = message.toString() === "ON";
            console.log("[mqtt] Estado enviado desde el Broker", ledState);
            //Envia actuañizacón a todos los clientes WebSocket
            broadcastLedStatus();
        }
    });
}

function publishSetLed(newState){
    client_mqtt.publish(config.TOPICS.LED_SET,newState);
}



module.exports = {
    initMQTT,
    msjMQTTReception,
    publishSetLed
};