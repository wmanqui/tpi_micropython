#import network
#Modulo que permite controlar tiempos y pausas
import time
#Modulo que proove acceso al hardware de la placa
import machine
#Permite conectar/suscribir/publicar en un broker MQTT
from umqtt.simple import MQTTClient

#Configuración MQTT 
MQTT_BROKER = "8e9c811d07444d56935a3fd2bd1b0341.s1.eu.hivemq.cloud"  
MQTT_PORT = 8883
MQTT_USER = "walter"
MQTT_PASSWORD = "Whitealbum1"
CLIENT_ID = b"esp32_client"
#Topicos mqtt
TOPIC_SET = b"esp32/led/set"
TOPIC_STATUS = b"esp32/led/status"

#Led integrado del esp32
led = machine.Pin(2, machine.Pin.OUT)

#Función que permite conectarse al broker "HiveMq cloud"
def connect_to_mqtt():
    ssl_params = {
        'server_hostname': MQTT_BROKER
    }
    mqtt_esp32_client = MQTTClient(
        client_id=CLIENT_ID,
        server=MQTT_BROKER,
        port=MQTT_PORT,
        user=MQTT_USER,
        password=MQTT_PASSWORD,
        ssl=True,
        ssl_params=ssl_params
    )
    try:
        mqtt_esp32_client.set_callback(mqtt_callback)
        mqtt_esp32_client.connect()
        print("Esp32 conectado a HiveMQ Cloud!!!")
        
        mqtt_esp32_client.subscribe(TOPIC_SET)
        print("Suscripto a:", TOPIC_SET)
        #Publica estado inicial
        publish_status(mqtt_esp32_client)
        return mqtt_esp32_client
    except Exception as e:
        print(f"Fallo la conexión del Esp32 a HiveMQ Cloud: {e}")
        return None
    
#Función que publica el estado del esp32    
def publish_status(client):
    state = b"ON" if led.value() == 1 else b"OFF"
    try:
        #client.publish(TOPIC_STATUS, state, retain=True)
        client.publish(TOPIC_STATUS, state)
        print("Estado publicado:",state)
    except Exception as e:
        print("Error publicando status:", e)

def mqtt_callback(topic, msg):
    print("Mensaje recibido:",topic,msg)
    if msg==b"ON":
        led.value(1)
        print("Esp32: LED encendido")
        #mqtt_esp32_client.publish(TOPIC_STATUS, b"LED_ON")
    elif msg==b"OFF":
        led.value(0)
        print("Esp32: LED apagado")
        #mqtt_esp32_client.publish(TOPIC_STATUS, b"LED_OFF")

#Programa principal
test_client = connect_to_mqtt()

if test_client:
    print("Esperando comandos MQTT...")
    while True:
        #Escucha mensajes mqtt
        test_client.check_msg()
        time.sleep(0.1)
