#Modulo que permite controlar tiempos y pausas
import time
#Permite conectar/suscribir/publicar en un broker MQTT
from umqtt.simple import MQTTClient
#Levanta variables del archivo de configuración
from config import (
    MQTT_BROKER, MQTT_PORT, MQTT_USER,
    MQTT_PASSWORD, CLIENT_ID,
    TOPIC_SET_LED1, TOPIC_STATUS_LED1
)

from pins_module import set_led, get_led_state

import wifi_module

#Variables globales
#last_ping = time.time()
last_ping = 0
PING_INTERVAL = 30
mqtt_esp32_client = None

#Función que permite conectarse al broker "HiveMq cloud"
def connect_to_mqtt():
    global mqtt_esp32_client, last_ping
    
    ssl_params = {
        'server_hostname': MQTT_BROKER
    }
    while True:
        try:
            print("[esp32] Intentando conectar...")
            mqtt_esp32_client = MQTTClient(
                client_id=CLIENT_ID,
                server=MQTT_BROKER,
                port=MQTT_PORT,
                user=MQTT_USER,
                password=MQTT_PASSWORD,
                ssl=True,
                ssl_params=ssl_params
            )
            
            mqtt_esp32_client.set_callback(mqtt_callback)
            mqtt_esp32_client.connect()
            
            print("[esp32] Esp32 conectado a HiveMQ Cloud!!!")
            mqtt_esp32_client.subscribe(TOPIC_SET_LED1)
            print("[esp32] Suscripto a:", TOPIC_SET_LED1)
            #Publica estado inicial
            
            publish_status(mqtt_esp32_client)
            #Resetea ping al conectar
            last_ping=time.time()
            return 
        
        except Exception as e:
            print(f"[esp32] Fallo la conexión del Esp32 a HiveMQ Cloud: {e}")
            print("Reintentando en 5 segundos...")
            time.sleep(5)
    
#Función que publica el estado del esp32    
def publish_status(client):
    estado = "ON" if get_led_state("LED1") else "OFF"
    client.publish(TOPIC_STATUS_LED1, estado)
    print("[esp32] Estado publicado:",estado)

def mqtt_callback(topic, msg):
    print("[esp32] Mensaje recibido:",topic,msg)
    
    topic = topic.decode()
    msg = msg.decode()
    
    if topic == TOPIC_SET_LED1:
        set_led("LED1", msg== "ON")
              
        estado = "ON" if get_led_state("LED1") else "OFF"
        mqtt_esp32_client.publish(TOPIC_STATUS_LED1, estado)
        print("[esp32] LED1:",estado)

def loop():
    global last_ping
    
    #Verifica la conexion wifi
    if not wifi_module.is_connected():
        print("[wifi] Conexión perdida: Reconectando wifi...")
        wifi_module.wifi_connection()
        time.sleep(1)
        
    #Escucha mensajes mqtt
    mqtt_esp32_client.check_msg()
    time.sleep(0.1)
        
    #Envia ping keep-alive para TLS
    if time.time() - last_ping > PING_INTERVAL:
        try:
            #Evita la conexion automatica del servidor
            mqtt_esp32_client.ping()
            print("[esp32] Ping enviado")
        except Exception as e:
            print("[esp32] Fallo el ping:",e)
            #Fuerza la reconexion
            raise
        
        last_ping = time.time()
    




