//Importa la libreria express
const express = require(`express`);
//Importa la libreria cors
const cors=require(`cors`);

const axios = require('axios');

//Ip del Esp32
const ESP32_IP = "http://192.168.1.19"; 


let ledState = false;


//Crea una aplicación express
const app = express();


//Permite que react haga peticiones desde otro puerto
app.use(cors());

//Define el puerto a escuchar
const PORT = 3001;

//Crea la ruta principal
app.get(`/`,(req,res)=>{
  res.send("Simulación de servidor esp32 funcionando correctamente");
});


// Encender LED en ESP32
app.get("/ON", async (req, res) => {
  try {
    const response = await axios.get(`${ESP32_IP}/ON`);
    res.send(response.data); // Devuelve la respuesta del ESP32 al frontend
    console.log("LED encendido en ESP32");
  } catch (error) {
    console.error("Error conectando con ESP32:", error.message);
    res.status(500).send("Error conectando con ESP32");
  }
});

// Apagar LED en ESP32
app.get("/OFF", async (req, res) => {
  try {
    const response = await axios.get(`${ESP32_IP}/OFF`);
    res.send(response.data);
    console.log("LED apagado en ESP32");
  } catch (error) {
    console.error("Error conectando con ESP32:", error.message);
    res.status(500).send("Error conectando con ESP32");
  }
});


app.listen(PORT,() => {
  console.log("Servidor vivo!!!!");
});