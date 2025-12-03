const mqtt = require("mqtt");
const config = require("./config")
const {setLed} = require("./state");



let client_mqtt = null;
//Notifica al WebSocket
let onUpdateCallback = null;

function initMQTT(onUpdate){
    onUpdateCallback = onUpdate;
    client_mqtt = mqtt.connect(`mqtts://${config.MQTT.BROKER}:${config.MQTT.PORT}`,{
        username: config.MQTT.USER,
        password: config.MQTT.PASSWORD,
    });
    //Realiza la conexiòn con el broker HiveMQ Client
    client_mqtt.on("connect",() =>{
        console.log("[mqtt] Conectado a HiveMQ CLoud");
        //Se suscribe al topico esp32/led/status 
        client_mqtt.subscribe(config.TOPICS.LED_STATUS, (err) => {
            if (!err) console.log("[mqtt] Suscripto a", config.TOPICS.LED_STATUS);
            else console.error("[mqtt] Error al subcribir a ", config.TOPICS.LED_STATUS,err );
        });
        //Se suscribe al topico esp32/sensor/status 
        client_mqtt.subscribe(config.TOPICS.SENSOR_READ, (err) => {
            if (!err) console.log("[mqtt] Suscripto a", config.TOPICS.SENSOR_READ);
            else console.error("[mqtt] Error al subcribir a ", config.TOPICS.SENSOR_READ,err );
        });

        client_mqtt.publish(config.TOPICS.BACKEND_INFO,"Backend conectado correctamente");
    });

    client_mqtt.on("message", (topic,message)=>{
        //const data = message.toString()
        if(topic === config.TOPICS.LED_STATUS){
            const value = message.toString() === "ON";
            console.log("[mqtt] Estado enviado desde el Broker", value);
            setLed("led1",value);
            if(onUpdateCallback) onUpdateCallback();
        }
        if(topic.startsWith("esp32/sensor/")){
            const sensor = topic.split("/")[2];
            console.log("[mqtt] Sensor ${sensor}:",value)
        }
    });




}
function publish(topic, message){
    if (!client_mqtt) return;
    client_mqtt.publish(topic, message);
}



module.exports = {
    initMQTT,
    publish
};