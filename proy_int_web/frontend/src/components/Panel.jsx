import React from "react";
import "./Panel.css";
import LedIndicator from "./LedIndicator";


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