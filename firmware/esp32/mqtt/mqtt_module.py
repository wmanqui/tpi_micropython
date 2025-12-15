#Modulo que permite controlar tiempos y pausas
import time
#Permite conectar/suscribir/publicar en un broker MQTT
from umqtt.simple import MQTTClient
#Levanta variables del archivo de configuración
from config import (
    MQTT_BROKER, MQTT_PORT, MQTT_USER,
    MQTT_PASSWORD, CLIENT_ID,
    TOPIC_ESP32_TO_BROKER, TOPIC_BROKER_TO_ESP32
)
#Importa funciones del modulo que maneja pines
from pins_module import set_led, get_led_state,blink_builtin, set_builtin
#Importa funciones del modulo wifi
import wifi_module

import uart_hc05_module

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
            #Registra la funcion "mqtt_callback" como manejador que 
            #sera llamada cuando llegue un msj suscripto
            mqtt_esp32_client.set_callback(mqtt_callback)
            #Establece la conexion 
            mqtt_esp32_client.connect()
            
            print("[esp32] Esp32 conectado a HiveMQ Cloud!!!")
            blink_builtin(times=3, delay=0.1)
            
            #Subscribe a los topicos         
            mqtt_esp32_client.subscribe(TOPIC_ESP32_TO_BROKER)
            print("[esp32] Suscripto a:", TOPIC_ESP32_TO_BROKER)
            
            mqtt_esp32_client.subscribe(TOPIC_BROKER_TO_ESP32)
            print("[esp32] Suscripto a:", TOPIC_BROKER_TO_ESP32)
            
            #Resetea ping al conectar
            last_ping=time.time()
            return 
        #si ocurre cualquier excepcón durante la creacion/conexion del cliente, 
        # se imprime el error y vuelve a intentar
        except Exception as e:
            print(f"[esp32] Fallo la conexión del Esp32 a HiveMQ Cloud: {e}")
            blink_builtin(times=2, delay=0.3)
            print("Reintentando en 5 segundos...")
            time.sleep(5)
    
#Función que publica el estado del esp32 al inicio(Trabajando solo con 1 led)  
def publish_status(client):
    status = "ON" if get_led_state("LED1") else "OFF"
    try:
        client.publish(TOPIC_STATUS_LED1, status)
        print("[esp32] Estado publicado:",status)
    except Exception as e:
        print("[esp32] Error publicando estado inicial:",e)

#Función llamada por MQTTClient cuando llega un msj
def mqtt_callback(topic, msg):
    global mqtt_esp32_client
    try:
        #Convierte bytes a str
        if isinstance(topic, bytes):
            topic = topic.decode()
        if isinstance(msg, bytes):
            msg = msg.decode()  
        
        print("[esp32] Mensaje recibido:",topic,msg)
        #Indicador de msj recibido
        set_builtin(True)
        time.sleep(0.05)
        set_builtin(False)

        if topic == TOPIC_BROKER_TO_ESP32:
            #Envia el msj recibido al hc-05 por UART
            uart_hc05_module.uart_send(msg)
            

    except Exception as e:
        print("[esp32] Error en callback MQTT",e)

#Esta función se encarga de verificar el wifi, procesar msjs 
# entrantes y enviar ping keep-alive
def mqtt_service():
    global last_ping, mqtt_esp32_client
    
    #Verifica y reconecta wifi si hace falta
    if not wifi_module.is_connected():
        print("[wifi] Conexión perdida: Reconectando wifi...")
        wifi_module.wifi_connection()
        time.sleep(1)
    try:
        #Revisa msj entrantes(invoca mqtt_callback() si hay)
        if mqtt_esp32_client is not None:
            mqtt_esp32_client.check_msg()
    except Exception as e:
        print("[esp32] Error check_msj",e)
        #Fuerza la reconexión
        raise
    time.sleep(0.05)
        
    #Envia ping keep-alive para TLS
    if time.time() - last_ping > PING_INTERVAL:
        try:
            if mqtt_esp32_client is not None:
                mqtt_esp32_client.ping()
                print("[esp32] Ping enviado")
                #Indicador de ping
                set_builtin(True)
                time.sleep(0.05)
                set_builtin(False)
            last_ping = time.time()            
        except Exception as e:
            print("[esp32] Fallo el ping:",e)
            #Fuerza la reconexion
            raise

def publish(topic, message):
    try:
        if mqtt_esp32_client is None:
            print("[esp32] publish: cliente MQTT no inicializado")
            return False
        
        mqtt_esp32_client.publish(topic, message)
        print("[esp32] Publicado en", topic, ":", message)
        return True
    except Exception as e:
        print("[esp32] Error al publicar:",e)
        return False
        
        
        
        
