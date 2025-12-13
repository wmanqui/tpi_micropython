/***********************************************************************************************/
/* Nombre del proyecto: Sistema de ambiente controlado                                         */
/* Descripción: Este software realiza mediciones periodicas de temperatura y humedad           */
/*              relativa, y en función de los rangos preseteados de maximos y mimimos          */
/*              activa o desactiva dispositivos, para obtener un ambiente controlado.          */
/*              Los estados de las salidas, la medición de temperatura y la medición           */
/*              de humedad relativa, son enviados a traves de una trama de salida por          */
/*              via bluetooth, para  ser interpretada y representada en una interfaz           */
/*              grafica de Procesing.                                                          */
/*              Por otra parte, permite modificar en forma dinamica desde la interfaz          */
/*              los rangos maximos y minimos, de temperatura y humedad.                        */
/*                                                                                             */
/*              Esta versión de firmware corresponde al modulo remoto y permite, recibir       */
/*              y enviar datos via bluetooth.                                                  */
/*                                                                                             */
/* Fecha: 13-12-25                                                                             */
/* Autor: Walter Rene Manqui                                                                   */
/* Versión: proy_int_arduino_mod_rem_v3.0                                                      */
/* Hardware:                                                                                   */
/*            -Sensor dht22 conectado al pin 2                                                 */
/*            -Modulo hc-05 conectado al pin 8,9                                               */
/*            -Rele_0 conectado al pin 3  para el control de la caldera de calefacción         */
/*            -Rele_1 conectado al pin 4  para el control del humidificador                    */
/*            -Rele_2 conectado al pin 5  para el control del ventilador                       */
/*            -Rele_3 conectado al pin 6  para el control del deshumidificador                 */
/* Librerias:                                                                                  */
/*            -DHT.h(Adafruit DHT sensor library)                                              */
/* Notas:                                                                                      */
/*                                                                                             */
/*                                                                                             */
/*                                                                                             */
/***********************************************************************************************/
#include "dht22_sensor.h"         //Modulo para el manejo del sensor DHT22
#include "automatic_control.h"    //Modulo para el control de la caldera, humidificador, ventilador y deshumidificador 
#include "output_frame.h"         //Modulo para enviar la trama de salida
#include "serial_communication.h" //Modulo para gestionar la comunicación serial
#include "command_handler.h"      //Modulo para procesamiento de comandos de entrada
//#include "nfc_pn532.h"            //Modulo que lector nfc PN532
#include "bluetooth.h"            //Modulo para el manejo de la comunicación bluetooth


static unsigned long sendTime = 10000;

void setup() {
  //Inicializaciòn de puerto serie
  serialCommunicationInitialization();
  delay(100);  
  //Inicializa pines las salidas
  relayInitialization();
  //Inicializa el sensor DHT22
  dht22SensorInitialization();
  // Inicializa módulo HC-05/06 para trabajar con arduino Uno
  bluetoothInit(false,8,9);     
  // Inicializa módulo HC-05/06 para trabajar con arduino Mega
  //bluetoothInit(true);            
  //Se envia el  mensaje con la versiòn del firmware
  serialSend("proy_int_web_v3.0 - Modulo Remoto");
}

void loop() {
  //Ingresa cuando se realiza una nueva lectura del sensor
  if (dht22SensorReading()){
      if(automaticMode){
        //Realiza el control automatico
        automaticControl();
      }
  }
  
  static unsigned long lastFrameTime = 0;
  if (millis() - lastFrameTime >= sendTime){
    lastFrameTime = millis();
    //Envia trama de salida por el puerto serie
    outputFrame(Serial);
    //Envia trama de salida via bluetooth
    outputFrame(*bluetoothGetPort());
  }

  //Lee los datos provenientes del módulo bluetooth
  Stream* btPort = bluetoothGetPort();
  if(btPort != nullptr && btPort->available()){
    String command = btPort->readStringUntil('\n');
    commandProcessing(command);
  }
}