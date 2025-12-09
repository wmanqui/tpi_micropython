#ifndef SENSOR_DHT22_H
#define SENSOR_DHT22_H

#include "DHT.h"
#include <Arduino.h>

// Pin al cual se encuentra conectado el sensor DHT22.
#define DHTPIN 2
// Tipo de sensor utilizado 
#define DHTTYPE DHT22

//Variable que almacena la humedad
extern float h; 
//variable que almaccena la temperatura
extern float t;
//Objeto del sensor DHT
extern DHT dht;

//Prototipo de funciones
void dht22SensorInitialization();
bool dht22SensorReading();

#endif
