#include "bluetooth.h"

static SoftwareSerial* btSerial = nullptr;
static bool serialPort1 = false;

//Inicialización del módulo bluetooth
void bluetoothInit(bool useSerial1, uint8_t rxPin, uint8_t txPin){
  serialPort1 = useSerial1;
  //Comunicación con la PC
  Serial.begin(9600);
#if defined(USART1_RX_vect)
     //Para Arduino Mega
     if(useSerial1){
      Serial1.begin(38400);
      //Serial1.begin(9600);
      Serial.println("Bluetooth listo(usando Serial1 - Arduino Mega)");
      return;
      }
#endif
    //Para Arduino Uno
    btSerial = new SoftwareSerial(rxPin, txPin);
    btSerial->begin(38400);
    //btSerial->begin(9600);
    Serial.print("Bluetooth listo(Software Serial en pines ");
    Serial.print(rxPin);
    Serial.print(",");
    Serial.print(txPin);
    Serial.println(")");
}


//Gestiona comunicación bidireccional
void bluetoothUpdate(){
#if defined(USART1_RX_vect)  
  if(serialPort1){
    //Comunicación con arduino Mega
    if(Serial.available()) Serial1.write(Serial.read());
    if(Serial1.available()) Serial.write(Serial1.read());
    return;
  }
#endif
  if(btSerial != nullptr){
    //Comunicación arduino Uno
    if(Serial.available()) btSerial->write(Serial.read());
    if(btSerial->available()) Serial.write(btSerial->read());
  }
}
//Envia datos via bluetooth
void bluetoothSend(const String & data){
#if defined(USART1_RX_vect)  
  //Comunicación con arduino Mega
  if(serialPort1){
    Serial1.write((data + "\n").c_str());
    return;
  }
#endif
  //Comunicación con arduino Uno
  if(btSerial != nullptr){
    btSerial->write((data + "\n").c_str());
  }
}
//Entrega el puerto bluetooth utilizado
Stream* bluetoothGetPort(){
  #if defined(USART1_RX_vect)
    if(serialPort1){
    return &Serial1;  // Arduino Mega
    }
  #endif
  return btSerial;    // Arduino Uno
}
