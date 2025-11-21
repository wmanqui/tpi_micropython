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

    //LLega mensaje del servidor
    ws.onmessage = (event) => {
      console.log("Mensaje del servidor:", event.data);
      //Convierte el texto a JSON
      const data = JSON.parse(event.data); 
     //Interpreta el tipo de mensaje
      if(data.type === "LED_STATE"){
        setLedOn(data.value);
      }
      
    };
    return () => ws.close();
  },[]);

  const toggleLed = () =>{
    if(socket){
      //Envia el JSON al servidor para solicitar modificación
      socket.send(JSON.stringify({
        action: "TOGGLE_LED"
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