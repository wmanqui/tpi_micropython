#ifndef BLUETOOTH_H
#define BLUETOOTH_H

#include <Arduino.h>
#include <SoftwareSerial.h>

//Inicializa el módulo bluetooth HC-05/06 dependiendo si el arduino es Uno/Mega
void bluetoothInit(bool useSerial1, uint8_t rxPin=2, uint8_t txPin=3);

//Gestiona la comunicación entre la PC y el módulo bluetooth
void bluetoothUpdate();
    
//Envia datos via bluetooth
void bluetoothSend(const String& data);

//Entrega el puerto bluetooth utilizado
Stream* bluetoothGetPort();

#endif