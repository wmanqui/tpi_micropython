import React, { useEffect} from "react";
import { RadialGauge } from "canvas-gauges";
import "./AnalogGauge.css";

const AnalogGauge = ({value}) =>{
    useEffect(() => {
        new RadialGauge({
            renderTo: "meterCanvas",
            width:250,
            height:250,
            units: "Temperatura °C",
            minValue:0,
            maxValue:100,
            startAngle:45,
            ticksAngle: 270,
            majorTicks: [
                "0","10","20","30","40","50","60","70","80","90","100"
            ],
            minorTicks:5,
            strokeTicks:true,
            highlights:[
                { from:0, to: 40, color: "#4caf50"},  //Azul(frío)
                { from:40, to: 70, color: "#ffc107"}, //Amarillo(normal)
                { from:70, to: 100, color: "#f44336"} //Rojo(caliete)
            ],
            needle: true,
            needleCircleOuter: false,
            needleCircleInner: false,
            borders: false,
            borderShadowWidth:4,          
            colorPlate: "#222",
            colorMajorTicks: "#fff",
            colorMinorTicks: "#ccc",
            colorTitle: "#fff",
            colorUnits: "#aaa",
            colorNumbers: "#eee",
            colorNeedle: "rgba(255,0,0,0.8)",
            valueBox: true,
            valueTextShadow: true,
            needleType: "arrow",
            needleWidth: 4,
            needleEnd: 85,
            valueInt: 2,
            animationRule: "easeInOut",
            animationDuration: 600,
            value,
        }).draw();
    }, [value]);
    return(
        <div className="meter-container">
            <canvas id="meterCanvas"></canvas>
        </div>
    ); 
};
export default AnalogGauge;