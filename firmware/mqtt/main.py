#Modulo que permite controlar tiempos y pausas
import time

import mqtt_module

mqtt_module.connect_to_mqtt()
print("[esp32] Sistema iniciado: esperando comandos MQTT...")
while True:
    try:
        mqtt_module.loop()
        time.sleep(0.1)
    except Exception as e:
        print("[mqtt] Error detectado",e)
        print("[mqtt] Intentando reconectar..." )
        mqtt_module.connect_to_mqtt()
        
    
