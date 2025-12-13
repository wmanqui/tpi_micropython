import time
#import uart_hc05_module
import mqtt_module
import json
import sys
import data_manipulation_module
from config import TOPIC_ESP32_TO_BROKER
from data_manipulation_module import frame_to_json
from uart_hc05_module import process_uart_data


# --- Solo debug ---
SIMULAR_TRAMA = True     
SIM_TIMEOUT = 30.0         
ultima_simulacion = 0

def process_simulated_data():
    global ultima_simulacion
    if not SIMULAR_TRAMA:
        return
    if time.time() - ultima_simulacion > SIM_TIMEOUT:
        trama_falsa = "$0;0;1;1;0;26.60;27.70"
        print("[SIM] Trama simulada:", trama_falsa)

        json_msg = data_manipulation_module.frame_to_json(trama_falsa)
        if json_msg:
            mqtt_module.publish(TOPIC_ESP32_TO_BROKER, json_msg)
            #mqtt_module.publish(TOPIC_HC05_UART_DATA, trama_falsa)
        
        ultima_simulacion = time.time()

#-------------------



def setup():
    # Inicializa la UART para comunicarse con el modulo HC-05
    #uart_hc05_module.init_uart_hc05()
    # Realiza la conexión con el Broker HiveMQ Cloud
    mqtt_module.connect_to_mqtt()
    print("[main] Sistema listo!!!")
    

def loop():
    while True:
        try:
            #Mantiene vivo el MQTT y procesa el mensaje
            mqtt_module.mqtt_service()  
            #Procesa trama enviada desde modulo hc-05
            #process_uart_data()          
            #Procesa trama simulada
            process_simulated_data()
            
            time.sleep(0.05)

        except Exception as e:
            print("[main] Error:", e)
            sys.print_exception(e)
            print("[main] Reintentando conectar MQTT...")
            try:
                mqtt_module.connect_to_mqtt()
            except Exception as e2:
                print("[main] Error, reconectando MQTT:", e2)
                time.sleep(5)


#Asegura que el codigo solo se ejecute si el archivo es el principal
if __name__ == "__main__":
    setup()
    loop()
    

