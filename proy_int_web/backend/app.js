//Importa la libreria express
const express = require(`express`);
//Importa la libreria cors
const cors=require(`cors`);


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


//Simula encender un Led
app.get(`/ON`,(req,res)=>{
  ledState = true;
  console.log("LED encendido");
  res.json({led:"on"});
});


//Simula apagar un Led
app.get(`/OFF`,(req,res)=>{
  ledState = false;
  console.log("LED apagado");
  res.json({led:"off"});
});


app.listen(PORT,() => {
  console.log("Servidor corriendo");
});