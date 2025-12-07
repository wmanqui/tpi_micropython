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
#Importa funciones del modulo que maneja pines
from pins_module import set_led, get_led_state,blink_builtin, set_builtin
#Importa funciones del modulo wifi
import wifi_module

#Variable para llevar cuando se envio el ultimo ping MQTT
last_ping = 0
#Intervalo en segundos para enviar pings keep-alive
PING_INTERVAL = 30
#variable para almacenar la instancia del cliente MQTT despues de conectar
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
            blink_builtin(times=1, delay=0.2)
            
            #Crea una instancia de MQTT client
            mqtt_esp32_client = MQTTClient(
                client_id=CLIENT_ID,
                server=MQTT_BROKER,
                port=MQTT_PORT,
                user=MQTT_USER,
                password=MQTT_PASSWORD,
                ssl=True,
                ssl_params=ssl_params
            )
            #Registra la funcion "mqtt_callback" como manejador que sera llamada cuando llegue un msj suscripto
            mqtt_esp32_client.set_callback(mqtt_callback)
            #Establece la conexion 
            mqtt_esp32_client.connect()
            
            print("[esp32] Esp32 conectado a HiveMQ Cloud!!!")
            blink_builtin(times=3, delay=0.1)
            
            mqtt_esp32_client.subscribe(TOPIC_SET_LED1)
            print("[esp32] Suscripto a:", TOPIC_SET_LED1)
            
            #Publica estado inicial
            publish_status(mqtt_esp32_client)
            #Resetea ping al conectar
            last_ping=time.time()
            return 
        #si ocurre cualquier excepcón durante la creacion/conexion del cliente, se imprime el error y vuelve a intentar
        except Exception as e:
            print(f"[esp32] Fallo la conexión del Esp32 a HiveMQ Cloud: {e}")
            blink_builtin(times=2, delay=0.3)
            print("Reintentando en 5 segundos...")
            time.sleep(5)
    
#Función que publica el estado del esp32    
def publish_status(client):
    status = "ON" if get_led_state("LED1") else "OFF"
    client.publish(TOPIC_STATUS_LED1, status)
    print("[esp32] Estado publicado:",status)

#Función llamada por MQTTClient cuando llega un msj
def mqtt_callback(topic, msg):
    print("[esp32] Mensaje recibido:",topic,msg)
    #Indicador de msj recibido
    set_builtin(True)
    time.sleep(0.05)
    set_builtin(False)
    
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
            #Indicador de ping
            set_builtin(True)
            time.sleep(0.05)
            set_builtin(False)
            
        except Exception as e:
            print("[esp32] Fallo el ping:",e)
            #Fuerza la reconexion
            raise
        
        last_ping = time.time()
    




