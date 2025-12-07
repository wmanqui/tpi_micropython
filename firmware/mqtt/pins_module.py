#Modulo que proove acceso al hardware de la placa
import machine

#Diccionario de LEDs
leds = {
    "LED_INT": machine.Pin(2, machine.Pin.OUT),
    "LED1": machine.Pin(15, machine.Pin.OUT),
}


def set_led(name, state):
    if name not in leds:
        print("[pins] LED no encontrado", name)
        return
    leds[name].value(1 if state else 0)
    print(f"[pins] {name} -> {'ON' if state else 'OFF'}")
    
def get_led_state(name):
    return leds[name].value() if name in leds else None
