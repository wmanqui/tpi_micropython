#Permite controlar los pines físicos de la placa (GPIO)
from machine import Pin

#LED integrado (pin 2)  
led = Pin(2, Pin.OUT)

def encender():
    led.value(1)
    print("LED encendido")
    
def apagar():
    led.value(0)
    print("LED apagado")
    
