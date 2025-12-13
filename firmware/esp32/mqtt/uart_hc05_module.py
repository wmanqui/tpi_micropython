import data_manipulation_module
#Modulo que permite controlar tiempos y pausas
import time
import mqtt_module
#Declara la variable global
uart_hc05 = None
#Importa la clase UART desde  el modulo machine
from machine import UART
from config import TOPIC_ESP32_TO_BROKER
from data_manipulation_module import frame_to_json

uart_buffer = ""

#Inicializa la UART para la comunicación con el modulo HC-05
def init_uart_hc05(baudrate =38400):
    global uart_hc05
    #Crea una instancia de UART
    uart_hc05 = UART(2, baudrate)
    print("[uart_hc05] UART 2 Inicializado. Baudrate:", baudrate)

#Función para enviar datos
def uart_send(text):
    #Comprueba si "uart_hc05" no ha sido inicializada
    if uart_hc05 is None:
        print("[uart_hc05] Error: UART no inicializado")
        return
    #Verifica si "text" es una cadena (str). Si lo es. prepara la cadena para enviarla como bytes.
    if isinstance(text, str):
        text = text + "\n"
        text = text.encode()
    uart_hc05.write(text)
    print("[uart_hc05] Enviado:", text)
"""
#Función para recibir datos    
def uart_read():
    #Comprueba si "uart_hc05" no ha sido inicializada
    if uart_hc05 is None:
        print("[uart_hc05] Error: UART no inicializado")
        return
    #Comprueba si hay datos disponibles en el buffer de recepción de la UART
    if uart_hc05.any():
        data = uart_hc05.read()
        if data:
            try:
                msg = data.decode().strip()
            except:
                msg = str(data)
            print("[uart_hc05] Recibido:", msg)
            return msg
    return None
        

def process_uart_data():
    # Leer desde el HC-05
    msg = uart_read() 
    if not msg:
        return
    
    print("[process_uart_data] Trama UART recibida:",msg)
    json_msg = data_manipulation_module.frame_to_json(msg)
    if json_msg:
        mqtt_module.publish(TOPIC_ESP32_TO_BROKER, json_msg)

"""

def process_uart_data():
    global uart_buffer

    if uart_hc05 is None:
        return
    
    if uart_hc05.any():
        data = uart_hc05.read()
        if not data:
            return
        try:
            uart_buffer += data.decode()
        except:
            return
    while "\n" in uart_buffer:
        frame, uart_buffer = uart_buffer.split("\n",1)
        frame = frame.strip()
        if not frame:
            continue
        print("[uart_hc05] Frame recibido,",frame)
        
        if not frame.startswith("$"):
            print("[uart_hc05] Frame invalido", frame)
            continue
        json_msg = data_manipulation_module.frame_to_json(frame)
        if json_msg:
            mqtt_module.publish(TOPIC_ESP32_TO_BROKER, json_msg)