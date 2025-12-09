#include "nfc_pn532.h"

//Crea el objeto nfc
Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

//Array para almacenar el UID leido
uint8_t uid[7];  // puede ser de 4 o 7 bytes
//Longitud dek UID leido
uint8_t uidLength;



/********************************************************************/
//Datos tomados de tags de prueba
const uint8_t Tag_Amarillo1[] = { 0xFC, 0x96, 0xD8, 0x04 };
const uint8_t Tag_Naranja1[]  = { 0x2E, 0x81, 0xCE, 0x04 };
const uint8_t Tag_Rosa1[]     = { 0x3B, 0x84, 0xD0, 0x04 };

//Vectores paralelos para manejar los tags registrados
const uint8_t* tagsRegistrados[] = { Tag_Amarillo1, Tag_Naranja1, Tag_Rosa1 };
//Almacena el tamaño de UID
const uint8_t tagsLength[]       = { sizeof(Tag_Amarillo1), sizeof(Tag_Naranja1), sizeof(Tag_Rosa1) };
//Nombres de cada tag
const char* nombresTags[]        = { "Amarillo", "Naranja", "Rosa" };
//Cantidad total de tags registrados
const uint8_t totalTags          = 3;


//Inicializa el modulo nfc PN532
void pn532Initialization(){
  //Inicializa el modulo
  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("No se detecto el modulo PN532. Revisar conexiones o modo I2C.");
    while (1);
  }
  else{
    Serial.println("Modulo 532 inicializado correctamente");    
  }
  //Configura el modulo para efectuar las lecturas
  nfc.SAMConfig();
}



//Entrega información de la version de firmware del modulo lector nfc 
void pn532GetInformation(){
  uint32_t versiondata = nfc.getFirmwareVersion();
  Serial.print("Lectot NFC: Chip PN5"); Serial.println((versiondata >> 24) & 0xFF, HEX);
  Serial.print("Versión de firmware: "); Serial.print((versiondata >> 16) & 0xFF);
  Serial.print('.'); Serial.println((versiondata >> 8) & 0xFF);
}

//Detecta la presencia de un tag
bool tagDetected(){
  bool detected = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength,20);
  return detected;
}

//Entrega información del tag leido
void tagInformation(){
    Serial.print("UID Longitud: "); Serial.print(uidLength, DEC); Serial.println(" bytes");
    Serial.print("UID: ");
    for (uint8_t i = 0; i < uidLength; i++) {
      Serial.print(" 0x"); Serial.print(uid[i], HEX);
    }
    Serial.println("");
}


bool compareUid(const uint8_t* uidToCompare, uint8_t uidToCompareLen){
  //Verifica que las longitudes coincidan
  if(uidLength != uidToCompareLen) return false;
  //Compara cada byte
  for(uint8_t i=0; i<uidLength; i++){
    if(uid[i]!=uidToCompare[i]) return false;  
  }
  return true;
 }



void identificarTag() {
  for (uint8_t i = 0; i < totalTags; i++) {
    //Compara el UID leido con cada UID registrado
    if (compareUid(tagsRegistrados[i], tagsLength[i])) {
      Serial.print("Tag detectado: ");
      Serial.println(nombresTags[i]);
      return;
    }
  }
  Serial.println("Tag desconocido");
}