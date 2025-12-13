#include "output_frame.h"
#include "automatic_control.h"

//Envio de trama de salida
//outputFrame = [caldera]; [humidificador]; [ventilador]; [deshumidificador]; [temperatura(°C)]; [humedad(%)]

void outputFrame(Stream &port){
  port.print("$0");
  port.print(";");
  port.print(heatingBoilerOn);
  port.print(";");
  port.print(humidifierOn);
  port.print(";");
  port.print(fanOn);
  port.print(";");
  port.print(dehumidifierOn);
  port.print(";");
  port.print(t);
  port.print(";");
  //port.print("°C;");   // quitar F()
  port.println(h);
  //port.println("%");   // quitar F()

}

