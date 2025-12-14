# ----------- WIFI -----------
WIFI_SSID = "Zhone_0328"
WIFI_PASSWORD = "Whitealbum@1"


# ----------- MQTT -----------
MQTT_BROKER = "8e9c811d07444d56935a3fd2bd1b0341.s1.eu.hivemq.cloud"       
MQTT_PORT = 8883                         
MQTT_USER = "walter"
MQTT_PASSWORD = "Whitealbum1"

# Identificador único del dispositivo
CLIENT_ID = "esp32_device_01"


# ----------- TOPICS MQTT -----------
# Encender/apagar LED desde el broker
TOPIC_SET_LED1 = "esp32/led1/set"

# Estado actual del LED1 reportado por el ESP32
TOPIC_STATUS_LED1 = "esp32/led1/status"

#Datos provenientes del HC-05 convertidos a JSON
#TOPIC_ESP32_TO_BROKER = "esp32/hc05/data"
TOPIC_ESP32_TO_BROKER = "esp32/hc05/send"

#Datos provenientes del broker
TOPIC_BROKER_TO_ESP32 = "esp32/hc05/receive"

