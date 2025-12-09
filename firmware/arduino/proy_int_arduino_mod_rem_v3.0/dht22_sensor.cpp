#include "dht22_sensor.h"

//Inicialización del objeto DHT
DHT dht(DHTPIN, DHTTYPE);

//Variable globales de lectura
float h = 0;
float t = 0;

//Inicialización del sensor
void dht22SensorInitialization(){
  dht.begin();
}

//Lectura de sensor de temperatura(°C) y humedad relativa(%) dht22
bool dht22SensorReading(){
  //Lectura periodica del sensor
  static unsigned long lastTime=0;
  if(millis() - lastTime >= 2000){
    lastTime = millis();
    //Medición de humedad relativa en %
    h = dht.readHumidity();
    //Medición de tenperatura en °C
    t = dht.readTemperature();
    // Check if any reads failed and exit early (to try again).
    if (isnan(h) || isnan(t)) {
      Serial.println(F("Fallo la lectura del sensor dht22"));
      return false;
    }
    //Hubo una nueva lectura
    return true; 
  }
  //Todavia no se efectuo una nueva lectura
  return false; 
}

