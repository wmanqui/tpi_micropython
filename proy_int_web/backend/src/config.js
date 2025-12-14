module.exports= {
    WS_PORT:3001,

    MQTT:{
        BROKER: "8e9c811d07444d56935a3fd2bd1b0341.s1.eu.hivemq.cloud",
        USER: "walter",
        PASSWORD: "Whitealbum1",
        PORT: 8883
    },

    TOPICS:{
        STATUS_LED1: "esp32/led/led1",
        SET_LED1:"esp32/cmd/led1",
        ESP32_TO_BROKER: "esp32/hc05/send",
        BROKER_TO_ESP32: "esp32/hc05/receive",
        BACKEND_INFO: "backend/info"
    }
};