import network

def connect_wifi(ssid, password):
    #Configura la placa como cliente wifi
    wlan = network.WLAN(network.STA_IF)
    #Activa la interfaz wifi
    wlan.active(True)
    #Conecta el esp32 a la red wifi
    wlan.connect(ssid, password)
    
    while not wlan.isconnected():
        pass
    #Devuelve una tupla(ip, mascara, gateway, dns)
    print("Conectando a wifi, IP:", wlan.ifconfig()[0])
    return wlan.ifconfig()[0]