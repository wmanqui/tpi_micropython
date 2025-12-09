//Libreria para comunicación I2C
#include <Wire.h>
//Libreria oficial para el manejo del NFC PN532
#include <Adafruit_PN532.h>

//Pin para manejar interrupciones
#define PN532_IRQ   (10)
//Pin para realizar reset por hardware 
#define PN532_RESET (11)

//Declaración del objeto principal
extern Adafruit_PN532 nfc;

//Array donde se almacena el UID leido
extern uint8_t uid[];  
//Largo del array del UID leido
extern uint8_t uidLength;

//UIDs registrados manualmente
extern const uint8_t Tag_Amarillo1[];
extern const uint8_t Tag_Naranja1[]; 
extern const uint8_t Tag_Rosa1[];

//Apunta a cada UID registrado
extern const uint8_t* tagsRegistrados[];
//Tamaño de cada UID
extern const uint8_t tagsLength[];
//Nombre asociado a cada tag
extern const char* nombresTags[];
//Cantidad total de tag registrados
extern const uint8_t totalTags;

//Inicializa el modulo nfc PN532
void pn532Initialization();
//Muestra información del firmaware
void pn532GetInformation();
//Detecta la presencia de un tag
bool tagDetected();
//Muestra el UID leido
void tagInformation();
//Compara el UID leido con el UID del argumento
bool compareUid(const uint8_t* uidToCompare, uint8_t uidToCompareLen);
//Identifica que tag fue detectado
void identificarTag();