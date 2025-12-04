#Este codigo se ejecuta al arranque
import esp
import machine
import ubinascii
import wifi_module
from wifi_module import wifi_connection

print("[boot] Iniciando esp32...")
#Reduce mensajes de debug del sistema
esp.osdebug(None)

#Genera id para identificar el dispositivo
DEVICE_ID = b"esp32_" + ubinascii.hexlify(machine.unique_id())
print("[boot] boot.py ejecutado Device id:", DEVICE_ID)

wifi_connection()

print("[boot] Completado.Ejecutando main.py...")


