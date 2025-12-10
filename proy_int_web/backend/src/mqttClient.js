/* ---------------------------------------------------
Este archivo se encarga de:

    1-Conectarse al broker MQTT.

    2-Suscribirse a los tópicos seteados.

    3-Cuando llega un mensaje MQTT → actualiza state.js.

    4-Comunicarse hacia el WebSocket usando un EventEmitter.

----------------------------------------------------- */



//Importa libreria mqtt para crear cliente MQTT y usar sus funciones.
const mqtt = require("mqtt");
//Importa archivo de configuración
const config = require("./config")
//Importa función desde el modulo state
const {setLed, setSensor} = require("./state");

const EventEmitter = require("events")


//Creación de EventEmitter para comunicar cambios
class MqttEvents extends EventEmitter{}
const mqttEvents = new MqttEvents();



//Variable que contendra el objeto cliente MQTT una vez iniciadp
let client_mqtt = null;


//Función que inicializa la conexión MQTT
function initMQTT(){
    //Crea el cliente MQTT
    client_mqtt = mqtt.connect(`mqtts://${config.MQTT.BROKER}:${config.MQTT.PORT}`,{
        username: config.MQTT.USER,
        password: config.MQTT.PASSWORD,
        connectTimeout: 10_000
    });
    //Realiza la conexion con el broker HiveMQ Client
    client_mqtt.on("connect",() =>{
        console.log("[mqtt] Conectado a HiveMQ CLoud");
        
        //Crea un arreglo con los tópicos a subscribir
        const subs = [
            config.TOPICS.SET_LED1,
            config.TOPICS.STATUS_LED1,
            config.TOPICS.SENSOR_READ
        ].filter(Boolean);
        
        //Subscribe a cada topico
        subs.forEach((t) => {
            client_mqtt.subscribe(t,{qos: 0}, (err) => {
                if (err) console.error("[mqtt] Error al subcribir a ", t,err );
                else console.log("[mqtt] Suscripto a", t);
            })
        });

        //Info de backend
        if(config.TOPICS.BACKEND_INFO){
            client_mqtt.publish(config.TOPICS.BACKEND_INFO,"Backend conectado correctamente");
        }
    });

    //Registra el handler que se ejecuta cada vez que llega un mensaje
    client_mqtt.on("message", (topic,messageBuffer)=>{
        //Convierte el buffer recibido a string para procesarlo.
        const payload = messageBuffer.toString();
        
        //Manejo de Leds
        if(topic.startsWith("esp32/led/")){
            const parts = topic.split("/")
            const ledName = parts[2];
            const value = payload === "ON";
            console.log(`[mqtt] LED ${ledName}:${value}`);
            //Actualiza el estado en state del  
            setLed(ledName,value);
            //Indica al websocket que el estado del led cambio
            mqttEvents.emit("ledUpdate",{
                led: ledName,
                value: value
            });
            return;
        }

        //Manejo del JSON 
        if (topic === "esp32/hc05/data"){
            console.log("[mqtt] JSON recibido:", payload);
            try{
                const data = JSON.parse(payload);
                if("temperatura" in data) setSensor("temperatura", data.temperatura);
                if("humedad" in data) setSensor("humedad", data.humedad);
                if("caldera" in data) setSensor("caldera", data.caldera);
                if("ventilador" in data) setSensor("ventilador", data.ventilador);
                if("humidificador" in data) setSensor("humidificador", data.humidificador);
                if("deshumidificador" in data) setSensor("deshumidificador", data.deshumidificador);

                mqttEvents.emit("sensorUpdate",data)
            } catch(err){
                console.error("[mqtt] Error al parsear JSON:", err);
            }

            return;
        }

    });
    //Handler para errores del cliente MQTT
    client_mqtt.on("error", (err) => {
        console.error("[mqtt] Error", err);
    });
    //Evento que se dispara cuando el cliente intenta reconectarse
    client_mqtt.on("reconnect", () => {
        console.error("[mqtt] Reintentando conexión...");
    });
    //Evento que indica el cierre de la conexión
    client_mqtt.on("close", () => {
        console.error("[mqtt] Conexión cerrada");
    });
}
//Función para publicar mensajes en el broker
function publish(topic, message){
    //Si el cliente no esta inicalizado, avisa y sale
    if (!client_mqtt){
        console.warn("[mqtt] Cliente no inicializado")
        return;
    }
    const payload = (typeof message === "string")? message: JSON.stringify(message);
    //Publica payload en topic 
    client_mqtt.publish(topic, payload, (err) => {
        if(err) console.error("[mqtt] Error publicado", err);
    })
}


module.exports = {
    initMQTT,
    publish,
    mqttEvents
};