#include "output_frame.h"
#include "automatic_control.h"

//Envio de trama de salida
//outputFrame = [caldera]; [humidificador]; [ventilador]; [deshumidificador]; [temperatura(°C)]; [humedad(%)]

void outputFrame(Stream &port){
/*
  Serial.print(heatingBoilerOn); //Estado de la caldera(1:encendida/0:apagada)
  Serial.print(";");
  Serial.print(humidifierOn);    //Estado del humidificador(1:encendido/0:apagado)
  Serial.print(";");
  Serial.print(fanOn);          //Estado del ventilador(1:encendido/0:apagado)
  Serial.print(";");
  Serial.print(dehumidifierOn); //Estado del deshumidificador(1:encendido/0:apagado)
  Serial.print(";");
  Serial.print(t);             //Lectura de la temperatura
  Serial.print(F("°C;"));     
  Serial.print(h);             //Lectura de la humedad de humedad relativa
  Serial.println(F("%"));
*/

  port.print(heatingBoilerOn);
  port.print(";");
  port.print(humidifierOn);
  port.print(";");
  port.print(fanOn);
  port.print(";");
  port.print(dehumidifierOn);
  port.print(";");
  port.print(t);
  port.print("°C;");   // quitar F()
  port.print(h);
  port.println("%");   // quitar F()

}

