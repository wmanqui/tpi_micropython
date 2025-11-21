//Importa la libreria express
const express = require(`express`);
//Importa la libreria cors
const cors=require(`cors`);

//Crea una aplicación express
const app = express();
//Permite que react haga peticiones desde otro puerto
app.use(cors());


const PORT_HTTP = 3001;
const PORT_WS = 3002;

//Crea la ruta principal
app.get(`/`,(req,res)=>{
  res.send("Servidor funcionando");
});


app.listen(PORT_HTTP,() => {
  console.log("Servidor vivo en !!!!", PORT_HTTP);
});