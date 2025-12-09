
#include "command_handler.h"
#include "automatic_control.h"
#include "output_frame.h"
#include "serial_communication.h"

//Variable externas compartidas
extern bool heatingBoilerOn;
extern bool humidifierOn;
extern float minTemp, maxTemp, minHumi, maxHumi, hystTemp, hystHumi;

//Define CommandFunction como puntero a función que recibe const String & y devuelve void.
typedef void (*CommandFunction)(const String &args);

//Estructura que representa un comando: su nombre, la función a ejecutar y una descripción
struct CommandEntry {
  //nombre del comando
  const char *name;
  //puntero a la funcion  que maneja el comando
  CommandFunction function;
  //descripcion breve
  const char *description;
};

//Funcion que representa la activacion del rele que controla la caldera
void cmdRele0On(const String &) {
  digitalWrite(relay_heatingBoiler, HIGH);
  //Actualiza valor de la variable del "frameOut" que indica  que se activo la caldera
  heatingBoilerOn = true;
  Serial.println("arduino: Caldera_Encendida");
  //Respuesta que se envia a Procesing para confirmar recepción y ejecución de solicitud
  Serial.println("OK");
}

//Funcion que representa la desactivacion del rele que controla la caldera
void cmdRele0Off(const String &) {
  digitalWrite(relay_heatingBoiler, LOW);
  //Actualiza valor de la variable del "frameOut" que indica  que se desactivo la caldera
  heatingBoilerOn = false;
  Serial.println("arduino: Caldera_Apagada");
  //Respuesta que se envia a Procesing para confirmar recepción y ejecución de solicitud
  Serial.println("OK");
}


//Función que representa la activación del rele que controla el humidificador
void cmdRele01On(const String &) {
  digitalWrite(relay_humidifier, HIGH);
  //Actualiza valor de la variable del "frameOut" que indica  que se activo el hunidificador
  humidifierOn = true;
  Serial.println("arduino: Humidificador_Encendido");
  //Respuesta que se envia a Procesing para confirmar recepción y ejecución de solicitud
  Serial.println("OK");
}

//Función que representa la desactivación del rele que controla el humidificador
void cmdRele01Off(const String &) {
  digitalWrite(relay_humidifier, LOW);
  //Actualiza valor de la variable del "frameOut" que indica  que se desactivo el humidificador
  humidifierOn = false;
  Serial.println("arduino: Humidificador_Apagado");
  //Respuesta que se envia a Procesing para confirmar recepción y ejecución de solicitud
  Serial.println("OK");
}

//Función que representa la activación del rele que controla el ventilador
void cmdRele02On(const String &) {
  digitalWrite(relay_fan, LOW);
  //Actualiza valor de la variable del "frameOut" que indica  que se activo el ventilador
  fanOn = true;
  Serial.println("arduino: Ventilador_Encendido");
  //Respuesta que se envia a Procesing para confirmar recepción y ejecución de solicitud
  Serial.println("OK");
}

//Función que representa la desactivación del rele que controla el ventilador
void cmdRele02Off(const String &) {
  digitalWrite(relay_fan, HIGH);
  //Actualiza valor de la variable del "frameOut" que indica  que se desactivo el ventilador
  fanOn = false;
  Serial.println("arduino: Ventilador_Apagado");
  //Respuesta que se envia a Procesing para confirmar recepción y ejecución de solicitud
  Serial.println("OK");
}

//Función que representa la activación del rele que controla el deshumidificador
void cmdRele03On(const String &) {
  digitalWrite(relay_dehumidifier, LOW);
  //Actualiza valor de la variable del "frameOut" que indica  que se activo el deshumidificador
  dehumidifierOn = true;
  Serial.println("arduino: Deshumidificador_Encendido");
  //Respuesta que se envia a Procesing para confirmar recepción y ejecución de solicitud
  Serial.println("OK");
}

//Función que representa la desactivación del rele que controla el deshumidificador
void cmdRele03Off(const String &) {
  digitalWrite(relay_dehumidifier, HIGH);
  //Actualiza valor de la variable del "frameOut" que indica  que se desactivo el deshumidifier
  dehumidifierOn = false;
  Serial.println("arduino: Deshumidificador_Apagado");
  //Respuesta que se envia a Procesing para confirmar recepción y ejecución de solicitud
  Serial.println("OK");
}

//Función que actualiza en forma dinamica el rango de temperatura
void cmdSetTemp(const String &args) {
  //Busca la posicion del signo "," que separa los valores del argumento
  int comma = args.indexOf(',');
  //Si encuentra el signo y su posicion es valida
  if (comma > 0) {
    //Almacena el valor antes del signo en "minTemp"
    minTemp = args.substring(0, comma).toFloat();
    //Almacena el valor despues del signo en "maxTemp"
    maxTemp = args.substring(comma + 1).toFloat();
    serialSend("arduino: Rango de temperatura actualizado");
    serialSend("OK");
  } else {
    serialSend("arduino: Error en formato SET_TEMP");
  }
}


//Función que actualiza en forma dinamica el rango de humedad
void cmdSetHumi(const String &args) {
  //Busca la posicion del signo "," que separa los valores del argumento
  int comma = args.indexOf(',');
  //Si encuentra el signo y su posicion es valida
  if (comma > 0) {
    //Almacena el valor antes del signo en "minHumi"
    minHumi = args.substring(0, comma).toFloat();
    //Almacena el valor despues del signo en "maxHumi"
    maxHumi = args.substring(comma + 1).toFloat();
    serialSend("arduino: Rango de humedad realtiva actualizado");
    serialSend("OK");
  } else {
    serialSend("arduino: Error en formato SET_HUMI");
  }
}

//Función que actualiza en forma dinamica el rango de histeresís
void cmdSetHyst(const String &args) {
  //Busca la posicion del signo "," que separa los valores del argumento
  int comma = args.indexOf(',');
  //Si encuentra el signo y su posicion es valida
  if (comma > 0) {
    //Almacena el valor antes del signo en "hystTemp"
    hystTemp = args.substring(0, comma).toFloat();
    //Almacena el valor despues del signo en "hystHumi"
    hystHumi = args.substring(comma + 1).toFloat();
    serialSend("arduino: histeresis actualizada");
    serialSend("OK");
  } else {
    serialSend("arduino: Error en formato SET_HYST");
  }
}

//Función que representa el cambio de trabajo a Modo Automatico
void cmdAutoModeOn(const String &) {
  automaticMode = true;
  Serial.println("arduino: Modo automatico");
  //Respuesta que se envia a Procesing para confirmar recepción y ejecución de solicitud
  Serial.println("OK");
}


//Función que representa el cambio de trabajo a Modo Manual
void cmdAutoModeOff(const String &) {
  automaticMode = false;
  Serial.println("arduino: Modo manual");
  
  digitalWrite(relay_heatingBoiler, LOW);
  heatingBoilerOn = false;
  digitalWrite(relay_humidifier, LOW);
  humidifierOn = false;
  digitalWrite(relay_fan, HIGH);
  fanOn = false;
  digitalWrite(relay_dehumidifier, HIGH);
  dehumidifierOn = false;

  //Respuesta que se envia a Procesing para confirmar recepción y ejecución de solicitud
  Serial.println("OK");
}



//Array que contiene los comandos disponibles
CommandEntry commandTable[] = {
  { "rele_0_on", cmdRele0On, "Activa caldera" },
  { "rele_0_off", cmdRele0Off, "Desactiva caldera" },
  { "rele_1_on", cmdRele01On, "Activa humidificador" },
  { "rele_1_off", cmdRele01Off, "Desactiva humidificador" },
  { "rele_2_on", cmdRele02On, "Activa ventilador" },
  { "rele_2_off", cmdRele02Off, "Desactiva ventilador" },
  { "rele_3_on", cmdRele03On, "Activa deshumidificador" },
  { "rele_3_off", cmdRele03Off, "Desactiva deshumidificador" },
  { "SET_TEMP", cmdSetTemp, "Setea rango de temperatura" },
  {"SET_HUMI", cmdSetHumi, "Setea rango de humedad"},
  {"SET_HYST", cmdSetHyst, "Setea histeresis(t,h)"},
  {"AUTO_MODE_ON", cmdAutoModeOn, "Modo automatico"},
  {"AUTO_MODE_OFF", cmdAutoModeOff, "Modo manual"}

};
//Variable que contiene el numero de elementos que contiene el array
const size_t COMMAND_COUNT = sizeof(commandTable) / sizeof(commandTable[0]);

//Funcion principal
void commandProcessing(const String &command) {
  String cmd = command;
  //Elimina espacios, al principio y al final
  cmd.trim();
  //Busca el signo":" para separar comando de argumentos
  int twoPointsIndex = cmd.indexOf(':');
  //Si existe el signo ":" almacena el nombre del comando en "name" y lo que viene despues en "args"
  //Si no existe el signo ":" almacena todo el string en "name"
  String name = (twoPointsIndex > 0) ? cmd.substring(0, twoPointsIndex) : cmd;
  String args = (twoPointsIndex > 0) ? cmd.substring(twoPointsIndex + 1) : "";

  //Busca coincidencias en la tabla
  for (size_t i = 0; i < COMMAND_COUNT; i++) {
    if (name.equalsIgnoreCase(commandTable[i].name)) {
      commandTable[i].function(args);
      return;
    }
  }
  serialSend("arduino: Comando no reconocido");
}










