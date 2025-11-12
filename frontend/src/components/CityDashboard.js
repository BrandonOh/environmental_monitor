import React, { useState, useEffect } from "react";
import { fetchCityCurrentReadings, fetchCityHistoricalReadings } from "../services/api";
import { getAQIColor, formatDate, formatTemperature } from "../utils/helpers";
import CityCharts from "./CityCharts";

function CityDashboard ({ city, onBack }){
    const [data, setData] = useState(null);
    const [historicalData, setHistoricalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tempUnit, setTempUnit] = useState('F');

    useEffect(() => {
        const loadCityData = async () => {
            try {
                setLoading(true);
                const [ currentResponse, historicalResponse] = await Promise.all([
                    fetchCityCurrentReadings(city.id),
                    fetchCityHistoricalReadings(city.id, 7)
                ]);
                setData(currentResponse);
                setHistoricalData(historicalResponse);

                console.log("Historical Data", historicalResponse)
                console.log("Air Readings", historicalResponse.air_quality_readings)
                console.log("Weather Reading", historicalResponse.weather_readings)

                setError(null);
            } catch (err) {
                setError('Failed to load city data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadCityData();
    }, [city.id]);

    if (loading) {
        return (
            <div className = "d-flex justify-content-center align-items-center p-5">
                <div className = "spinner-border text-primary" role = "status">
                    <span className = "visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className = "alert alert-danger" role="alert">
                <p className = "mb-2">{error}</p>
                <button onClick = {onBack} className = "btn btn-sm btn-outline-primary">
                    Back to Cities
                </button>
            </div>
        )
    }

    const { air_quality, weather } = data;

    return (
        <div className = "container">
            <div className = "card shadow-lg mb-4">
                <div className = "card-body">
                    <div>
                        <button
                            onClick = {onBack}
                            className = "btn btn-link text-decoration-none p-0 mb-3"
                        >
                            Back to Cities
                        </button>
                    </div>
                    <div className = "btn-group" role = "group">
                        <button
                            type = "button"
                            className = {`btn btn-sm ${tempUnit === 'F' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick = {() => setTempUnit('F')}
                        >
                            °F
                        </button>
                        <button
                            type = "button"
                            className = {`btn btn-sm ${tempUnit === 'C' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick = {() => setTempUnit('C')}
                        >
                            °C
                        </button>
                    </div>
                    <h1 className = "display-5 fw-bold mb-2">
                        {city.name}, {city.country}
                    </h1>
                    <p className = "text-muted">
                        {city.latitude}°N, {city.longitude}°E
                    </p>
                </div>
            </div>

            {air_quality ? (
                <div className = "card shadow-lg mb-4">
                    <div className = "card-body">
                        <h2 className = "card-title h4 fw-semibold mb-4">
                            Air Quality
                        </h2>
                        <div className = "d-flex align-items-center justify-content-between mb-4 pb-4 border-bottom">
                            <div>
                                <div
                                    className = "display-2 fw-bold"
                                    style = {{ color: getAQIColor(air_quality.aqi) }}
                                >
                                    {air_quality.aqi}
                                </div>
                                <div className = "h5 fw-medium text-secondary mt-2">
                                    {air_quality.aqi_category}
                                </div>
                                <div className = "small text-muted mt-2">
                                    {formatDate(air_quality.timestamp)}
                                </div>
                            </div>
                        </div>

                        <div className = "row row-cols-2 row-cols-md-3 g-3">
                            {air_quality.pm25 && (
                                <div className = "col">
                                    <div className = "card bg-light border-0">
                                        <div className = "card-body">
                                            <div className = "small text-muted"> PM2.5 </div>
                                            <div className = "h4 f2-semibold mb-0">
                                                {air_quality.pm25.toFixed(1)}
                                            </div>
                                            <div className = "small text-muted">μg/m³</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {air_quality.pm10 && (
                                <div className = "col">
                                    <div className = "card bg-light border-0">
                                        <div className = "card-body">
                                            <div className = "small text-muted">PM10</div>
                                            <div className = "h4 fw-semibold mb-0">
                                                {air_quality.pm10.toFixed(1)}
                                            </div>
                                            <div className = "small text-muted">μg/m³</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {air_quality.co && (
                                <div className = "col">
                                    <div className = "card bg-light border-0">
                                        <div className = "card-body">
                                            <div className = "small text-muted">CO</div>
                                            <div className = "h4 fw-semibold mb-0">
                                                {air_quality.co.toFixed(1)}
                                            </div>
                                            <div className = "small text-muted">μg/m³</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {air_quality.no2 && (
                                <div className = "col">
                                    <div className = "card bg-light border-0">
                                        <div className = "card-body">
                                            <div className = "small text-muted">NO₂</div>
                                            <div className = "h2 fw-semibold mb=0">
                                                {air_quality.no2.toFixed(1)}
                                            </div>
                                            <div className = "small text-muted">μg/m³</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {air_quality.o3 && (
                                <div className = "col">
                                    <div className = "card bg-light border-0">
                                        <div className = "card-body">
                                            <div className = "small text-muted">O₃</div>
                                            <div className = "h4 fw-semibold mb-0">
                                                {air_quality.o3.toFixed(1)}
                                            </div>
                                            <div className = "small text-muted">μg/m³</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {air_quality.so2 && (
                                <div className = "col">
                                    <div className = "card bg-light border-0">
                                        <div className = "card-body">
                                            <div className = "small text-muted">SO₂</div>
                                            <div className="h4 fw-semibold mb-0">
                                                {air_quality.so2.toFixed(1)}
                                            </div>
                                            <div className="small text-muted">μg/m³</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className = "alert alert-warning" role = "alert">
                    <strong>No air quality data availible</strong>
                    <p className = "mb-0">Add readings via Django admin to see data here</p>
                </div>                
            )}
            
            {weather ? (
                <div className = "card shadow-lg mb-4">
                    <div className = "card-body">
                        <h2 className = "card-title h4 fw-semibold mb-4">
                            Weather Conditions
                        </h2>
                        <div className = "row row-cols-2 row-cols-md-4 g-3">
                            <div className = "col">
                                <div className = "card bg-light border-0">
                                    <div className ="card-body">
                                        <div className = "small text-muted">Temperature</div>
                                        <div className = "h3 fw-semibold mb-0">
                                            {formatTemperature(weather.temperature, tempUnit)}
                                        </div>
                                        {weather.feels_like && (
                                            <div className = "small text-muted">
                                                Feels like {formatTemperature(weather.feels_like, tempUnit)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className = "col">
                                <div className = "card bg-light border-0">
                                    <div className = "card-body">
                                        <div className = "small text-muted">Humidity</div>
                                        <div className = "h3 fw-semibold mb-0">
                                            {weather.humidity}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className = "col">
                                <div className = "card bg-light border-0">
                                    <div className = "card-body">
                                        <div className = "small text-muted">Pressure</div>
                                        <div className = "h3 fw-semibold mb-0">
                                            {weather.pressure}
                                        </div>
                                        <div className = "small text-muted">hPa</div>
                                    </div>
                                </div>
                            </div>
                            {weather.wind_speed && (
                                <div className = "col">
                                    <div className = "card bg-light border-0">
                                        <div className = "card-body">
                                            <div className = "small text-muted">Wind Speed</div>
                                            <div className = "h3 fw-semibold mb-0">
                                                {weather.wind_speed.toFixed(1)}
                                            </div>
                                            <div className = "small text-muted">m/s</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {weather.weather_description && (
                            <div className = "text-center text-muted mt-3 text-capitalize">
                                {weather.weather_description}
                            </div>
                        )}
                        <div className = "text-center small text-muted mt-2">
                            {formatDate(weather.timestamp)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-warning" role = "alert">
                    <strong>No weather data availible</strong>
                    <p className = "mb-0">Add readings via Django admin to see data here.</p>
                </div>
            )}

            { historicalData &&
              historicalData.air_quality_readings?.length > 0 &&
              historicalData.weather_readings?.length > 0 && (
                <CityCharts
                    airReadings = {historicalData.air_quality_readings}
                    weatherReadings = {historicalData.weather_readings}
                    tempUnit = {tempUnit}
                />
              )    
            }
        </div>
    );
}        

export default CityDashboard;