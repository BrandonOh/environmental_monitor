const API_BASE = process.env.NODE_ENV === 'production'
? '/api'
: 'http://localhost:8000/api';

export const fetchCities = async () => {
    try {
        const response = await fetch(`${API_BASE}/cities/`);
        if (!response.ok) throw new Error('Failed to fetch cities');
        return await response.json();
    } catch (error) {
        console.error('Error fetching cities: ', error);
        throw error;
    }
};

export const fetchCityDetail = async (cityId) => {
    try {
        const response = await fetch(`${API_BASE}/cities/${cityId}/`);
        if (!response.ok) throw new Error('Failed to fetch city details');
        return await response.json();
    } catch (error) {
        console.error('Error fetching city details: ', error);
        throw error;
    }
};

export const fetchCityCurrentReadings = async (cityId) => {
    try {
        const response = await fetch(`${API_BASE}/cities/${cityId}/current/`);
        if (!response.ok) throw new Error('Failed to fetch current readings');
        return await response.json();
    } catch (error) {
        console.error('Error fetch current readings: ', error);
        throw error;
    }
};

export const fetchCityHistoricalReading = async (cityId, days = 7) => {
    try {
        const response = await fetch(`${API_BASE}/cities/${cityId}/readings/?days=${days}`);
        if (!response.ok) throw new Error('Failed to fetch historical readings');
        return await response.json();
    } catch (error) {
        console.error('Error fetching historical readings: ', error);
        throw error;
    }
};

export const fetchCitiesStats = async (cityId, days = 30) => {
    try {
        const response = await fetch(`{API_BASE}/cities/${cityId}/stats/?days=${days}`);
        if (!response.ok) throw new Error('Failed to fetch city stats');
        return await response.json();
    } catch (error) {
        console.error('Error fetching city stats: ', error);
        throw error;
    }
};

export const fetchCompareCities = async (cityIds) => {
    try {
        const idsString = cityIds.join(',');
        const response = await fetch(`${API_BASE}/compare/?cities=${idsString}`);
        if(!response.ok) throw new Error('Failed to compare cities');
        return await response.json();
    } catch (error) {
        console.error('Error comparing cities: ', error);
        throw error;
    }
};