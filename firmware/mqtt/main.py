#Modulo que permite controlar tiempos y pausas
import time
#Modulo que proove acceso al hardware de la placa
import machine
#Permite conectar/suscribir/publicar en un broker MQTT
from umqtt.simple import MQTTClient
#Levanta variables del archivo de configuración
from config import MQTT_BROKER, MQTT_PORT, MQTT_USER, MQTT_PASSWORD, CLIENT_ID, TOPIC_SET_LED1, TOPIC_STATUS_LED1


#Led integrado del esp32
led = machine.Pin(2, machine.Pin.OUT)

mqtt_esp32_client = None

#Función que permite conectarse al broker "HiveMq cloud"
def connect_to_mqtt():
    global mqtt_esp32_client
    
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
            return mqtt_esp32_client
        
        except Exception as e:
            print(f"[esp32] Fallo la conexión del Esp32 a HiveMQ Cloud: {e}")
            print("Reintentando en 5 segundos...")
            time.sleep(5)
    
#Función que publica el estado del esp32    
def publish_status(client):
    state = b"ON" if led.value() == 1 else b"OFF"
    try:
        #client.publish(TOPIC_STATUS, state, retain=True)
        client.publish(TOPIC_STATUS_LED1, state)
        print("[esp32] Estado publicado:",state)
    except Exception as e:
        print("[esp32] Error publicando status:", e)

def mqtt_callback(topic, msg):
    print("[esp32] Mensaje recibido:",topic,msg)
    if msg==b"ON":
        led.value(1)
        print("[esp32] LED_1 encendido")
        #mqtt_esp32_client.publish(TOPIC_STATUS, b"LED_ON")
        mqtt_esp32_client.publish(TOPIC_STATUS_LED1, b"ON")
    elif msg==b"OFF":
        led.value(0)
        print("[esp32] LED_1 apagado")
        #mqtt_esp32_client.publish(TOPIC_STATUS, b"LED_OFF")
        mqtt_esp32_client.publish(TOPIC_STATUS_LED1, b"OFF")
    
#Programa principal
test_client = connect_to_mqtt()
print("[esp32] Esperando comandos MQTT...")
while True:
    try:
        #Escucha mensajes mqtt
        test_client.check_msg()
        time.sleep(0.1)
    except Exception as e:
        print("[mqtt] Error detectado",e)
        print("[mqtt] Intentando reconectar..." )
        client = connect_to_mqtt()
