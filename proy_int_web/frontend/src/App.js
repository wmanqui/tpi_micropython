import React, {useState} from "react";
import AnalogGauge from "./components/AnalogGauge";
import LedIndicator from "./components/LedIndicator";
import ControlButton from "./components/ControlButton";
import Panel from "./components/Panel";


function App(){

  //IP local del ESP32 
  const ESP32_IP = "http://localhost:3001" 
 
  //led1: alamacena el estado actual de la variable
  //setled1: función para cambiar el estado
  const[ledOn,setLedOn] = useState(false);
  

  const toggleLed = async() =>{
    const newState =! ledOn? "ON": "OFF";
    try{
      //Envia la orden al ESP32(realiza petición http)
      await fetch(`${ESP32_IP}/${newState}`);
      setLedOn((prev) => !prev);

    }
    catch(error){
      console.error("salvenos quien pueda", error);
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