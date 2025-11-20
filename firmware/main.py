#Este programa enciende y apaga el led integrado en la placa esp32 desde un frontend
#hecho en Reactjs que a la vez se conecta con un servidor de nodejs


from wifi_module import connect_wifi
from server_module import iniciar_servidor
from led_module import encender, apagar

ssid = "Zhone_0328"
password = "Whitealbum@1"

#Ip de la placa esp32
ip = connect_wifi(ssid, password)


# Función que maneja las peticiones HTTP
def manejar_peticion(request):
    if '/ON' in request:
        encender()
        return "LED encendido"
    elif '/OFF' in request:
        apagar()
        return "LED apagado"
    else:
        return "Uso: /ON o /OFF"

#Inicia servidor en el puerto 80
iniciar_servidor(80, manejar_peticion)