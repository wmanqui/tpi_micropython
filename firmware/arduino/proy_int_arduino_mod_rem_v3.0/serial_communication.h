#ifndef SERIAL_COMMUNICATION_H
#define SERIAL_COMMUNICATION_H

#include <Arduino.h>

// Variable para almacenar el comando de entrada
extern String inputCommand;

//Funciones

//Inicialización de comunicación serie
void serialCommunicationInitialization(unsigned long baudRate = 9600);
//Envio de comandos
void serialSend(const String &msg);
//Verifica si hay un nuevo dato disponible
bool serialDataAvailable();
//Devuelve el último comando leído
String serialReadCommand();

#endif