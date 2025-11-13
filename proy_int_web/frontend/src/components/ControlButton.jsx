import React from "react";
import "./ControlButton.css";

const ControlButton = ({ isOn, onClick, labelOn = "Encendido", labelOff = "Apagado"}) =>{
    return(
        <button className={`control-button ${isOn ? "btn-on" : "btn-off"}`} onClick={onClick}>
            {isOn? labelOn :  labelOff}
        </button>
    );
};

export default ControlButton;