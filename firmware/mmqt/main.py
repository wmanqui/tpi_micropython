import network
import time
import machine
import ussl
from umqtt.simple import MQTTClient

# ========= CONFIG WIFI =========
WIFI_SSID = "Zhone_0328"
WIFI_PASS = "Whitealbum@1"

# ========= CONFIG MQTT =========
MQTT_HOST = "xxxxxxx.s2.eu.hivemq.cloud"  # tu hostname
MQTT_PORT = 8883
MQTT_USER = "tu_usuario"
MQTT_PASS = "tu_password"
MQTT_CLIENT_ID = "esp32_walter"
TOPIC_SUB = b"casa/led"
TOPIC_PUB = b"casa/status"

# ========= LED =========
led = machine.Pin(2, machine.Pin.OUT)  # LED integrado ESP32

# ========= Conectar WIFI =========
def conectar_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASS)
    print("Conectando WiFi...", end="")
    while not wlan.isconnected():
        print(".", end="")
        time.sleep(0.5)
    print("\nWiFi conectado:", wlan.ifconfig())

# ========= Callback MQTT =========
def mqtt_callback(topic, msg):
    print("Mensaje recibido:", topic, msg)

    if msg == b"ON":
        led.value(1)
        print("LED encendido")

    elif msg == b"OFF":
        led.value(0)
        print("LED apagado")

# ========= Conectar MQTT SSL =========
def conectar_mqtt():
    with open("ca.pem", "rb") as f:
        cert = f.read()

    client = MQTTClient(
        client_id=MQTT_CLIENT_ID,
        server=MQTT_HOST,
        port=MQTT_PORT,
        user=MQTT_USER,
        password=MQTT_PASS,
        ssl=True,
        ssl_params={"cert": cert}
    )

    client.set_callback(mqtt_callback)
    client.connect()
    print("Conectado a HiveMQ Cloud")

    client.subscribe(TOPIC_SUB)
    print("Suscrito a", TOPIC_SUB)

    return client

# ========= PROGRAMA PRINCIPAL =========
conectar_wifi()
client = conectar_mqtt()

client.publish(TOPIC_PUB, b"ESP32 conectado")

# Loop
while True:
    try:
        client.check_msg()  # Espera mensajes
    except Exception as e:
        print("Error MQTT:", e)
        time.sleep(3)
