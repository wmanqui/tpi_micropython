#Modulo que proove acceso al hardware de la placa
import machine
#Importa funciones de tiempo
import time

#Diccionario de LEDs
leds = {
    "LED1": machine.Pin(15, machine.Pin.OUT),
}

#Led integrado utilizado para debug
led_builtin = machine.Pin(2, machine.Pin.OUT)



def set_led(name, state):
    if name not in leds:
        print("[pins] LED no encontrado", name)
        return
    leds[name].value(1 if state else 0)
    print(f"[pins] {name} -> {'ON' if state else 'OFF'}")
    
def get_led_state(name):
    return leds[name].value() if name in leds else None


def set_builtin(state:bool):
    #Enciende o apaga el led integrado
    led_builtin.value(1 if state else 0)
    
def blink_builtin(times=3, delay=0.2):
    for _ in range(times):
        led_builtin.value(1)
        time.sleep(delay)
        led_builtin.value(0)
        time.sleep(delay)