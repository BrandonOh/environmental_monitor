import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CityCharts = ({ airReadings, weatherReadings, tempUnit }) => {
    
    const aqiData = airReadings.map( reading => ({
        time: new Date( reading.timestamp ).toLocaleDateString(),
        AQI: reading.aqi,
        PM25: reading.pm25,
        PM10: reading.pm10
    }));

    const tempData = weatherReadings.map( reading => {
        const temp = tempUnit === 'F'
            ? (reading.temperature * 9/5) + 32
            : reading.temperature;
            
        return {
            time: new Date( reading.timestamp ).toLocaleDateString(),
            Temperature: parseFloat(temp.toFixed(1)),
            Humidity: reading.humidity
        }
    });

    return (
        <div className = "mt-4">
            <h3>Air Quality Trends (7 days)</h3>
            <ResponsiveContainer width = "100%" height = { 300 }>
                <LineChart data = { aqiData }>
                    <CartesianGrid strokeDasharray = "3 3" />
                    <XAxis dataKey = "time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type = "monotone" dataKey = "AQI" stroke = "#8884d2" strokeWidth = { 2 } />
                    <Line type = "monotone" dataKey = "PM10" stroke = "#3c97beff" strokeWidth = { 2 } />
                    <Line type = "monotone" dataKey = "PM25" stroke = "#82ca9d" strokeWidth = { 2 } />
                </LineChart>
            </ResponsiveContainer>

            <h3 className = "mt-4">Weather Trends (7 Days)</h3>
            <ResponsiveContainer width = "100%" height = { 300 }>
                <LineChart data = { tempData }>
                    <CartesianGrid strokeDasharray = "3 3" />
                    <XAxis dataKey = "time"/>
                    <YAxis label = {{ value: `Temperature (°${tempUnit})`, angle: -90, position: "insideLeft"}}/>
                    <Tooltip />
                    <Legend />
                    <Line type = "monotone" dataKey = "Temperature" stroke = "#ff7300" strokeWidth = { 2 } />
                    <Line type = "monotone" dataKey = "Humidity" stroke = "#387908" strokeWidth = { 2 } />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CityCharts