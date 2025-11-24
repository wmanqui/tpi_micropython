import React, { useEffect, useState } from "react";
import LedIndicator from "./components/LedIndicator";
import ControlButton from "./components/ControlButton";
import Panel from "./components/Panel";

function App() {
  const [socket, setSocket] = useState(null);
  const [ledOn, setLedOn] = useState(false);

  useEffect(() => {
    // 🔥 MOCK DEL SERVIDOR WEBSOCKET (no usa backend real)
    const ws = {
      send: (msg) => {
        const parsed = JSON.parse(msg);
        console.log("Mock WS recibió:", parsed);

        if (parsed.type === "GET_STATUS") {
          setTimeout(() => {
            setLedOn(false); // Estado inicial simulado
          }, 300);
        }

        if (parsed.type === "SET_LED") {
          setLedOn(parsed.data === "ON");
        }
      },
      close: () => {}
    };

    setSocket(ws);
    ws.send(JSON.stringify({ type: "GET_STATUS" }));

    return () => ws.close();
  }, []);

  const toggleLed = () => {
    if (socket) {
      const newState = !ledOn ? "ON" : "OFF";
      socket.send(
        JSON.stringify({
          type: "SET_LED",
          data: newState
        })
      );
    }
  };

  return (
    <>
      <Panel title="TABLERO DE CONTROL_1">
        <LedIndicator label="Test_01" isOn={ledOn} />
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
