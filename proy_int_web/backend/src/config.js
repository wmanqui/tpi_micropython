module.exports= {
    WS_PORT:3001,

    MQTT:{
        BROKER: "8e9c811d07444d56935a3fd2bd1b0341.s1.eu.hivemq.cloud",
        USER: "walter",
        PASSWORD: "Whitealbum1",
        PORT: 8883
    },

    TOPICS:{
        LED_STATUS: "esp32/led/led1",
        LED_SET:"esp32/led/set",
        SENSOR_READ: "esp32/sensor/status",
        BACKEND_INFO: "backend/info"
    }
};