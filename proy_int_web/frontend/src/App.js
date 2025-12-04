import React, {useEffect,useState} from "react";
//import AnalogGauge from "./components/AnalogGauge";
import LedIndicator from "./components/LedIndicator";
import ControlButton from "./components/ControlButton";
import Panel from "./components/Panel";


function App(){

  //Crea variable "socket" y la inicializa en "null"
  //"setSocket" permite cambiar "socket"
  const[socket, setsocket] = useState(null);

  //Crea variable "ledOn" y la inicializa en "false"
  //"setLedOn" permite cambiar "setLedOn"
  const[ledOn,setLedOn] = useState(false);
  

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
        //setLedOn(msg.data.led);
        setLedOn(msg.data.leds["led1"]);
      }
      if(msg.type === "LED_UPDATE"){
        //setLedOn(msg.data.led);
        setLedOn(msg.data.leds["led1"]);

      }
      
    };
    return () => ws.close();
  },[]);

  const toggleLed = () =>{
    if(socket){
      //Decide el nuevo estado
      const newState = !ledOn? "ON" : "OFF"; 
      //Envia el JSON al servidor para solicitar modificación
      socket.send(JSON.stringify({
        type: "SET_LED",
        data: newState
      }));
    }

  };

  return(
  <>
  <Panel title="TABLERO DE CONTROL_1">
    <LedIndicator 
        label="Test_01" 
        isOn={ledOn}
    />
  </Panel>
  <Panel title="TABLERO DE CONTROL_2">
    <ControlButton 
        isOn={ledOn} 
        onClick={toggleLed}
        labelOn="Led 1_On"
        labelOff="Led 1_Off"
    />
  </Panel>
  </>

  );
}






export default App;