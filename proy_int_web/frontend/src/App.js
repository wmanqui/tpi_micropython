import React, {useEffect,useState} from "react";
import AnalogGauge from "./components/AnalogGauge";
import LedIndicator from "./components/LedIndicator";
import ControlButton from "./components/ControlButton";
import Panel from "./components/Panel";


function App(){

  //Crea variable "socket" y la inicializa en "null"
  //"setSocket" permite cambiar "socket"
  const[socket, setsocket] = useState(null);

  
  const[leds,setLeds] = useState({
    led1:false,
    led2:false,
    led3:false,
    led4:false
  });

  const[temperature, setTemperature] = useState(0);
  const[humidity, setHumidity] = useState(0);

  useEffect(() => {
    //Se conecta al WebSocket 
    const ws= new WebSocket("ws://localhost:3001");
    setsocket(ws);

    ws.onopen = () => {
      ws.send(JSON.stringify({type: "GET_STATUS"}));
    }

    //LLega mensaje del servidor
    ws.onmessage = (event) => {
      //Convierte el texto a JSON
      const msg = JSON.parse(event.data);
      //Interpreta el tipo de mensaje
      if(msg.type === "STATUS"){
        setLeds({
          led1:msg.data.leds["led1"],
          led2:msg.data.leds["led2"],
          led3:msg.data.leds["led3"],
          led4:msg.data.leds["led4"],
        })
      setTemperature(msg.data.sensors.temperatura);
      setHumidity(msg.data.sensors.humedad);
      
      }
      if(msg.type === "UPDATE"){
        setLeds({
          led1:msg.data.leds["led1"],
          led2:msg.data.leds["led2"],
          led3:msg.data.leds["led3"],
          led4:msg.data.leds["led4"],
        })
      setTemperature(msg.data.sensors.temperatura);
      setHumidity(msg.data.sensors.humedad);
      }
      

    };
    return () => ws.close();
  },[]);

  const toggleLed = () =>{
    if(socket){
      //Decide el nuevo estado
      // const newState = !ledOn? "ON" : "OFF"; 
      //Envia el JSON al servidor para solicitar modificación
      socket.send(JSON.stringify({
        type: "SET_LED",
        //data: newState
      }));
    }

  };

  return(
  <>
  <Panel title="TABLERO DE CONTROL_1">
    <LedIndicator label="Caldera"     isOn={leds.led1}/>
    <LedIndicator label="Humidificador"     isOn={leds.led2}/>
    <LedIndicator label="Ventilador"     isOn={leds.led3}/>
    <LedIndicator label="Deshumidificador"     isOn={leds.led4}/>
  </Panel>
<Panel title="TABLERO DE CONTROL_2">
    <AnalogGauge value={temperature}/>
</Panel>
<Panel title="TABLERO DE CONTROL_3">
    <AnalogGauge value={humidity}/>
</Panel>



</>
  );
}






export default App;