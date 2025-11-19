import network
import socket
from machine import Pin

# LED integrado (pin 2)
led = Pin(2, Pin.OUT)

# Conectar a WiFi
ssid = "Zhone_0328"
password = "Whitealbum@1"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

while not wlan.isconnected():
    pass

print("Conectado a WiFi, IP:", wlan.ifconfig()[0])

# Servidor web simple
addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]
s = socket.socket()
s.bind(addr)
s.listen(1)
print("Escuchando en", addr)

while True:
    cl, addr = s.accept()
    print('Cliente conectado desde', addr)
    request = cl.recv(1024)
    request = str(request)
    
    if '/ON' in request:
        led.value(1)
        response = "LED encendido"
    elif '/OFF' in request:
        led.value(0)
        response = "LED apagado"
    else:
        response = "Uso: /ON o /OFF"
    
    cl.send('HTTP/1.0 200 OK\r\nContent-type: text/plain\r\n\r\n')
    cl.send(response)
    cl.close()
