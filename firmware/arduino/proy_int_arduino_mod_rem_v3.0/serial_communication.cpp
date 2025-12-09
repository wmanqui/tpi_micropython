#include "serial_communication.h"

// Variable para almacenar el comando de entrada
String inputCommand = "";


//Inicialización de puerto serie
void serialCommunicationInitialization(unsigned long baudRate){
  //Inicialización
  Serial.begin(baudRate);
  //Espera hasta que el puerto se inicie 
  while(!Serial){
    ;
  }
  Serial.println(F("...Comunicación serial inicializada"));
}

//Envio de comandos
void serialSend(const String &msg){
  Serial.println(msg);
}

//Verifica si hay un nuevo dato disponible
bool serialDataAvailable(){
  if (Serial.available()>0){
      //Lee los datos del buffer de entrada
      inputCommand = Serial.readStringUntil('\n');
      //Elimina espacios vacios
      inputCommand.trim();
      return true;
      }
  return false;
}

//Enva el comando leido
String serialReadCommand(){
  return inputCommand;
}
