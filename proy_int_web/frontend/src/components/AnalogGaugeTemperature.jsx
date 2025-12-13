import React, { useEffect, useRef } from "react";
import { RadialGauge } from "canvas-gauges";
import "./AnalogGauge.css";


const AnalogGaugeTemperature = ({ value }) => {
    const canvasRef = useRef(null);
    const gaugeRef = useRef(null);
    
    //Crea el gaunge una sola vez
    useEffect(() => {

        if (!canvasRef.current) return;

        gaugeRef.current = new RadialGauge({
            renderTo: canvasRef.current,
            width: 200,
            height: 200,
            units: "Temperatura °C",
            minValue: 0,
            maxValue: 40,
            startAngle: 45,
            ticksAngle: 270,

            majorTicks: [
                "0", "5","10","15", "20","25", "30","35", "40"
            ],

            minorTicks: 5,
            strokeTicks: true,

            highlights: [
                { from: 0, to: 21, color: "#0e2da7ff" },
                { from: 21, to: 26, color: "#28b94aff" },
                { from: 26, to: 40, color: "#f44336" }
            ],

            needle: true,
            needleCircleOuter: false,
            needleCircleInner: false,

            borders: false,
            borderShadowWidth: 4,

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

            value:0
        });
        gaugeRef.current.draw();
    }, []);

    useEffect(() => {
        if(gaugeRef.current){
            gaugeRef.current.update({value});
        }

    },[value]);


    return (
        <div className="meter-container">
            <canvas ref={canvasRef} width={"250"} height={"250"}></canvas>
        </div>
    );
};

export default AnalogGaugeTemperature;
