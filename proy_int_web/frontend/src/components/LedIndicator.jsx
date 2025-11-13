import React from "react";
import "./LedIndicator.css"

const LedIndicator = ({isOn, label}) => {
    return(
        <div className="led-wrapper">
            <div className={`led ${isOn ? "led-on" : "led-off"}`}></div>
            {label && <span className="led-label">{label}</span>}
        </div>
    );
};

export default LedIndicator;