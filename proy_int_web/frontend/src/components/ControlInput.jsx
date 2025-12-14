import React, { useState, useRef, useEffect } from "react";
import "./ControlInput.css"



//Array con comandos predefinidos
const PRESET_COMMANDS = [
    "AUTO_MODE_OFF","AUTO_MODE_ON",
    "rele_0_on","rele_0_off",
    "rele_1_on","rele_1_off",
    "rele_2_on","rele_3_off",
    "rele_3_on","rele_3_off",
    "SET_TEMP","SET_HUMI",
    "SET_HYST"
];


//Props del componente
const ControlInput = ({
    //texto actual del input
    value,
    //Función para modificar el texto
    onChange,
    //Texto gris de ayuda
    placeholder = "",
    //Indica si el comando es valido o no
    isValid = true,
}) => {
    //"open" indica si el menu esta abierto
    const[open, setOpen] = useState(false);
    //Variable que indica si el usuario hizo click fuera del componente
    const wrapperRef = useRef(null);
    
    useEffect(() => {
        //Función que detecta clics
        const handleClickOutside = (e) => {
            //Si el componente existe y el click no fue dentro del componente cierra el menu
            if(wrapperRef.current && !wrapperRef.current.contains(e.target)){
                setOpen(false);
            }

        };
        //Escucha clics en toda la página
        document.addEventListener("mousedown", handleClickOutside);
        //limpia el evento cuando el componente se destruye
        return() => document.removeEventListener("mousedown",handleClickOutside);
    },[]);
    //Función que se llama al hacer click sobre un comando
    const selectCommand = (cmd) => {
        //Actualiza el texto del input con el comando seleccionado
        onChange({target:{value: cmd}});
        //Cierra el menu
        setOpen(false);
    };

    return(
        <div className="control-input-wrapper" ref={wrapperRef}>
            <button
                className="cmd-menu-btn"
                onClick={() => setOpen(!open)}
                type="button"
            >▾</button>

            <input
                className={`control-input ${isValid ? "valid" : "invalid"}`}
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            {open &&(
                <div className="cmd-dropdown">
                    {PRESET_COMMANDS.map((cmd) =>(
                        <div
                            key={cmd}
                            className="cmd-item"
                            onClick={() => selectCommand(cmd)}
                        >
                           {cmd}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default ControlInput;