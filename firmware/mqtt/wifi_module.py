#Importa la libreía de micropython que controla la interfaz wifi
import network
#Importa funciones de tiempo
import time
#Levanta variables del archivo de configuración
from config import WIFI_SSID, WIFI_PASSWORD

#Tiempo máximo que espera el loop, para realizar la conexión
timeout = 15
#Reintentos para realizar la conexión
retries = 3
#Retardo al realizar reintento
retry_delay = 5

#Instancia la clase
wlan = network.WLAN(network.STA_IF)
    
#Función que activa la interfaz si esta apagada
def _ensure_active():
    if not wlan.active():
        wlan.active(True)

#Función que realiza la conexión a la red wifi
def wifi_connection():
    _ensure_active()
    #Si ya esta conectado devuelve esta información
    if wlan.isconnected():
        print("[wifi] El modulo ya se encuentra conectado a:", WIFI_SSID)
        print("[wifi] Dirección de ip asignada:", wlan.ifconfig()[0])
        return True

    attempt=0
    while attempt < retries:
        attempt += 1
        try:
            print(f"[wifi] Intento {attempt}/{retries}: conectando a {WIFI_SSID}...")
            #Inicia la conexión a la red wifi
            wlan.connect(WIFI_SSID, WIFI_PASSWORD)    
        except Exception as e:
            print("[wifi] Error al llamar wlan.connect():",e)

        t0 = time.time()
        while not wlan.isconnected():
            if time.time() - t0 > timeout:
                print(f"[wifi] Timeout ({timeout}s) en intento {attempt}")
                break
            time.sleep(1)

        if wlan.isconnected():
            ip=wlan.ifconfig()[0]
            print("[wifi] Conexión establecida. IP:",ip)
            return True

        if attempt<retries:
            print(f"[wifi] Reintetando en {retry_delay}s...")
            time.sleep(retry_delay)
    print("[wifi] No se pudo realizar conexión tras",retries,"intentos")
    return False


#Función que solo indica si el modulo esta conectado
def is_connected():
    wlan = network.WLAN(network.STA_IF)
    return wlan.isconnected()
    
#wifi_connection()

#is_connected()


