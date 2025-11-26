import network
import time
from umqtt.simple import MQTTClient

#Settings de HiveMQ Cloud 
MQTT_BROKER = "8e9c811d07444d56935a3fd2bd1b0341.s1.eu.hivemq.cloud"  
MQTT_PORT = 8883
MQTT_USER = "walter"
MQTT_PASSWORD = "Whitealbum1"
CLIENT_ID = "esp32_client"
TOPIC = "test/topic"

def connect_to_mqtt():
    ssl_params = {
        'server_hostname': MQTT_BROKER
    }
    client = MQTTClient(
        client_id=CLIENT_ID,
        server=MQTT_BROKER,
        port=MQTT_PORT,
        user=MQTT_USER,
        password=MQTT_PASSWORD,
        ssl=True,
        ssl_params=ssl_params
    )
    try:
        client.connect()
        print("Esp32 conectado a HiveMQ Cloud!!!")
        return client
    except Exception as e:
        print(f"Fallo la conexión del Esp32 a HiveMQ Cloud: {e}")
        return None

#Programa principal
client = connect_to_mqtt()
if client:
    client.publish(TOPIC, "Hola mundo desde ESP32")
    client.disconnect()