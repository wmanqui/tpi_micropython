
import time
import bluetooth

#Nombre visible para la conexión bluetooth
BT_NAME = "ESP32_BT"

#Instancia global 
bt = bluetooth. Bluetooth()



def bt_init():
    print("[bt] Inicializando bluetooth")
    bt.active(True)
    bt.config(name=BT_NAME)

    bt.config(tx_power=2)

    print("[bt] Bluetooh activado como: ", BT_NAME)
    print("[bt] Esperando conexión SPP...")

    #Espera hasta que el dispositivo se conecte
    while not bt.isconnected():
        time.sleep(0.5)
        print(".", end="")
    
    print("\n [bt] Dispositivo conectado via bluetooth!")


#Función que envia texto via Bluetooth
def bt_send(text):
    if not bt.isconnected():
        print("[bt] Error: No hay conexión bluetooth")
        return
    
    bt.send(text)
    print("[bt] Enviado por Bluetooth", text)


#Lee datos entrantes desde el dispositivo conectado
def bt_check():
    if not bt.isconnected():
        return None
    
    data = bt.recv(128)

    if data:
        print("[bt] Recibido desde dispositivo conectado", data.decoded())
        return data.decode()
    
    return None