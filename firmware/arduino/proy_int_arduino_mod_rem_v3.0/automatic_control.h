#ifndef AUTOMATIC_CONTROL_H
#define AUTOMATIC_CONTROL_H

#include <Arduino.h>
#include "dht22_sensor.h"


//Variables de los pines 
extern int relay_heatingBoiler;
extern int relay_humidifier;
extern int relay_fan;
extern int relay_dehumidifier;

//Flags de estado
extern bool heatingBoilerOn;
extern bool humidifierOn;
extern bool fanOn;
extern bool dehumidifierOn;

//Variables de límites
extern float minTemp;
extern float maxTemp;
extern float minHumi;
extern float maxHumi;
extern float hystTemp;
extern float hystHumi;


extern bool automaticMode;

//Funciones
void relayInitialization();
void automaticControl();

#endif