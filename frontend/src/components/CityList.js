import React, {useState, useEffect } from "react";
import { fetchCities } from '../services/api';

function CityList({ onCitySelect }) {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        loadCities();
    }, []);

    const loadCities = async () => {
        try {
            setLoading(true);
            const data = await fetchCities();
            setCities(data);
            setError(null);
        } catch (err) {
            setError('Failed to load cities');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className = "d-flex justify-content-center align-items-center p-5">
                <div className = "spinner-border text-primary" role = "status">
                    <span className = "visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className = "alert alert-danger m-4" role="alert">
                <p className = "mb-2">{error}</p>
                <button
                    onClick = {loadCities}
                    className = "btn btn-sm btn-outline-danger"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className = "card shadow-lg">
            <div className = "card-body">
                <h2 className = "card-title h2 fw-bold mb-4">
                    Select a City
                </h2>
                <div className = "row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {cities.map(city => (
                        <div className = "cols" key={city.id}>
                            <button
                                onClick = {() => onCitySelect(city)}
                                className = "btn btn-outline-primary w-100 text-start p-3 h-100"
                            >
                                <h3 className = "h5 fw-semibold mb-1">
                                    {city.name}
                                </h3>
                                <p className = "text-muted mb-1">{city.country}</p>
                                {city.population && (
                                    <p className = "small text-muted mb-0">
                                        Pop: {city.population.toLocaleString()}
                                    </p> 
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>    
        </div>
    );
}

export default CityList;