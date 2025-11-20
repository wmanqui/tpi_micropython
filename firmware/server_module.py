import socket

#Este modulo se encarga de recibir solicitudes HTTP

def iniciar_servidor(port, manejar_peticion):
    #Servidor web simple
    addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]
    #Crea un socket TCP/IP
    s = socket.socket()
    #Asocia el socket con la direccion y puerto
    s.bind(addr)
    #Escucha una conexiòn a la vez
    s.listen(1)
    #Indica que el servidor esta corriendo y escuchando
    print("Escuchando en", addr)
    while True:
        #Espera que un cliente se conecte y devuelve: cl(socket del cliente)/addr(ip del cliente)
        cl, addr = s.accept()
        print('Cliente conectado desde', addr)
        #Peteción http
        request = cl.recv(1024)
        #Conversión a string
        request = str(request)
        #Decide que hacer segun la URL
        response = manejar_peticion(request)
        #Cabecera HTTP básica para decir que la respuesta es texto plano
        cl.send('HTTP/1.0 200 OK\r\nContent-type: text/plain\r\n\r\n')
        #Envia el msj "LED encendido/LED apagado"
        cl.send(response)
        #Cierra la conexión con el cliente
        cl.close()
        