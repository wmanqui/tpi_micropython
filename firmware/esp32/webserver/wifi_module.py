#Modulo para manejar interfaces de red
import network
#Modulo para manejar retardos
import time

#Configuración de red wifi
#SSID = "Zhone_0328"
#PASSWORD = "Whitealbum@1"
SSID = "NPI INGENIERIA"
PASSWORD = "2019Electricos"

#Función que permite que el esp32 se conecte a la red wifi
def wifi_connection():
    #instancia la clase.
    #network.STA_IF, indica que la placa trabajara como cliente 
    wlan = network.WLAN(network.STA_IF)
    #activa la interface
    wlan.active(True)
    #inicia la conexión
    wlan.connect(SSID, PASSWORD)

    print("Conectando a wifi...")
    #este bucle se ejecuta hasta que la placa obtenga una dirección de ip
    while not wlan.isconnected():
        time.sleep(0.5)
    
    print("Conexión de wifi establecida!!!")
    print("Dirección de ip asignada a esp32:", wlan.ifconfig()[0])
    #devuelve la direccion de ip
    return wlan.ifconfig()[0]
    
wifi_connection()