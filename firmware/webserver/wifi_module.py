#Permite manejar wifi
import network
#Permite retardos
import time

#Configuración de red wifi
#SSID = "Zhone_0328"
#PASSWORD = "Whitealbum@1"
SSID = "NPI INGENIERIA"
PASSWORD = "2019Electricos"

#Conexion wifi
def wifi_connection():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)

    print("Conectando a wifi...")
    while not wlan.isconnected():
        time.sleep(0.5)
    
    print("Conexión de wifi establecida!!!")
    print("Dirección de ip asignada a esp32:", wlan.ifconfig()[0])
    return wlan.ifconfig()[0]
    
wifi_connection()