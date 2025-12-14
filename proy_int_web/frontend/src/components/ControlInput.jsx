import React from "react";
import "./ControlInput.css"




const PRESET_COMMANDS = [
    "STATUS","LED1_ON"
];



const ControlInput = ({
    value,
    onChange,
    placeholder = "",
}) => {
    return(
        <input
            className="control-input"
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
};

export default ControlInput;