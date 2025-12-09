#include "automatic_control.h"

//Declaracion del pin al cual se conecta la caldera
int relay_heatingBoiler = 3;
//Declaracion del pin al cual se conecta el humidificador
int relay_humidifier = 4;
//Declaracion del pin al cual se conecta el ventilador
int relay_fan = 5;
//Declaracion del pin al cual se conecta el deshumificador
int relay_dehumidifier = 6;

//Inicialización de flags de estado
bool heatingBoilerOn=false;
bool humidifierOn=false;
bool fanOn=false;
bool dehumidifierOn=false;

//Preseteo de límites de trabajo "stand alone"
float minTemp = 21;  //°C
float maxTemp = 26;  //°C
float minHumi = 40;  // %
float maxHumi = 60;  // %
float hystTemp = 2;  //°C
float hystHumi = 15;  //%

//Arduino arranca en modo automatico
bool automaticMode=true;


void relayInitialization(){
  //Array que contiene los pines de salidas
  const int outputPins[] = {relay_heatingBoiler, relay_humidifier, relay_fan, relay_dehumidifier };
  //Tamaño del array de los pines de salida
  int n = sizeof(outputPins) / sizeof(outputPins[0]);
  for(int i=0; i<n; i++ ){
    //Configura como salida todos los pines del array "outputPins"
    pinMode(outputPins[i], OUTPUT);
    if(i<2){
      //Inicializa pines en bajo por el hardware de la placa del rele
      digitalWrite(outputPins[i],LOW);
    }
    else{
      //Inicializa pines en alto por el hardware de la placa del rele
      digitalWrite(outputPins[i],HIGH);
    }
  }
}

//Función para el control automatico de la caldera, humidificador, ventilador y deshumidificador
void automaticControl(){
  /*********** Control de Caldera *********/
  //Si la temperatura medida es menor que el limite inferior seteado y la caldera esta desactivada
  if(!heatingBoilerOn && t < minTemp){ 
    //Se enciende la caldera 
    digitalWrite(relay_heatingBoiler,HIGH);
    //Actualiza el flag de estado
    heatingBoilerOn = true;
  //Si la temperatura medida es mayor al limite inferior + el valor de histeresis seteado    
  }else if(heatingBoilerOn && t > (minTemp + hystTemp)){
    //Se apaga la caldera
    digitalWrite(relay_heatingBoiler,LOW);
    //Actualiza el flag de estado
    heatingBoilerOn = false;
  }

  /*********** Control del Ventilador *********/
  //Si la temperatura medida es mayor al limite superior y el ventilador esta desactivado
   if(!fanOn && t > maxTemp){ 
    //Se enciende el ventilador 
    digitalWrite(relay_fan,LOW);
    //Actualiza el flag de estado
    fanOn = true;
  //Si la temperatura medida es menor al limite superior - el valor de histeresis seteado    
  }else if(fanOn && t < (maxTemp - hystTemp)){
    //Se apaga el ventilador
    digitalWrite(relay_fan,HIGH);
    //Actualiza el flag de estado
    fanOn = false;
  }

  /********Control del humidificador ***********/
  //Si la humedad medida es menor que la seteada en el limte inferior y el humidificador esta desactivado
  if(!humidifierOn && h < minHumi){
    //Se enciende el humidificador
    digitalWrite(relay_humidifier,HIGH);
    //Actualiza el flag de estado
    humidifierOn = true;
  //Si la huemdad relativa medida es mayor al limite inferior + el valor de histeresis seteado    
  }else if(humidifierOn && h > (minHumi + hystHumi)){
    //Se apaga el humidificador
    digitalWrite(relay_humidifier,LOW);
    //Actualiza el flag de estado
    humidifierOn =false;
  }

  /********Control del deshumidificador ***********/
  //Si la humedad medida es mayor al limite superior y el deshumificador esta desactivado
   if(!dehumidifierOn && h>maxHumi){ 
    //Se enciende el deshumidificador 
    digitalWrite(relay_dehumidifier,LOW);
    //Actualiza el flag de estado
    dehumidifierOn = true;
  //Si la humedad medida es menor al limite superior - el valor de histeresis seteado    
  }else if(dehumidifierOn && h<(maxHumi - hystHumi)){
    //Se apaga el deshumidificador
    digitalWrite(relay_dehumidifier,HIGH);
    //Actualiza el flag de estado
    dehumidifierOn = false;
  }
}