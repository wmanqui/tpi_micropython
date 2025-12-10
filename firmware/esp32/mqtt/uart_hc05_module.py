

import data_manipulation_module
#Modulo que permite controlar tiempos y pausas
import time

#Declara la variable global
uart_hc05 = None
#Importa la clase UART desde  el modulo machine
from machine import UART
from data_manipulation_module import frame_to_json


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

#Función para recibir datos    
def uart_read():
    #Comprueba si "uart_hc05" no ha sido inicializada
    if uart_hc05 is None:
        print("[uart_hc05] Error: UART no inicializado")
        return
    #Comprueba si hay datos disponibles en el buffer de recepción de la UART
    if uart_hc05.any():
        data = uart_hc05.readline()
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
    
    print("[main] Trama UART recibida:",msg)
    json_msg = data_manipulation_module.frame_to_json(msg)
    if json_msg:
        mqtt_module.publish(TOPIC_HC05_UART_DATA, json_msg)

