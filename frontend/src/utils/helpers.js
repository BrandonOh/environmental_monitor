export const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
};

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatTemperature = (celsius, unit = 'C') => {
    if (unit === 'F') {
        const fahrenheit = (celsius * 9/5) + 32;
        return `${fahrenheit.toFixed(1)}°F`;
    }
    return `${celsius.toFixed(1)}°C`;
}

export const calculateAverage = (numbers) => {
    if (!numbers || numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}