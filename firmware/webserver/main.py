#Permite crear un servidor web
import socket
#Permite el control de los pines
import machine
#Permite la conexión wifi
import wifi_module

#LED en el pin 2 
led = machine.Pin(2, machine.Pin.OUT)


#Servidor http simple
def start_server():
    ip = wifi_module.wifi_connection()
    addr = socket.getaddrinfo(ip, 80)[0][-1]
    s = socket.socket()
    s.bind(addr)
    s.listen(5)

    print("Servidor HTTP corriendo en:", ip)

    while True:
        cl, addr = s.accept()
        print("Cliente conectado:", addr)

        request = cl.recv(1024)
        request = request.decode("utf-8")
        print("Petición:", request)

        # Endpoints
        if "GET /ON" in request:
            led.value(1)
            #response = "LED ENCENDIDO"
            response = '{"led": true}'
            print("LED -> ON")

        elif "GET /OFF" in request:
            led.value(0)
            #response = "LED APAGADO"
            response = '{"led": false}'
            print("LED -> OFF")
        
        elif "GET /status" in request:
            estado_led = led.value() == 1
            response = '{"led": %s}' % ("true" if estado_led else "false")
            print("Status enviado:", response)

        else:
            response = "COMANDO INVALIDO"

        # Respuesta HTTP obligatoria
        cl.send("HTTP/1.1 200 OK\r\n")
        cl.send("Content-Type: text/plain\r\n")
        cl.send("Connection: close\r\n\r\n")
        cl.send(response)

        cl.close()

start_server()