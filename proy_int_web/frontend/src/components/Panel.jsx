import React from "react";
import "./Panel.css";
import LedIndicator from "./LedIndicator";

/*
const Panel = ({isOn, label}) => {
    return(
        <div className="panel-metal">
            <div className="panel-title">TABLERO DE CONTROL</div>
                <div className="led-row">
                    <LedIndicator label="Test_01" isOn={true}/>
                    <LedIndicator label="Test_02" isOn={true}/>
                    <LedIndicator label="Test_03" isOn={true}/>
                    <LedIndicator label="Test_04" isOn={true}/>
                </div>
        </div>

    );
}
*/

const Panel = ({title, children}) => {
    return(
        <div className="panel-metal">
            <div className="panel-title">{title}</div>
                <div className="panel-content">
                    {children}
                </div>
        </div>

    );
}

export default Panel