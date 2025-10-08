import React, {useState} from 'react';
import CityList from './components/CityList';
import CityDashboard from './components/CityDashboard';
import './App.css';

function App() {
  const [selectedCity, setSelectedCity] = useState (null);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleBack = () => {
    setSelectedCity(null)
  };

  return (
    <div className = "min-vh-100 bg-light">
      <header className = "bg-white shadow-sm">
        <div className = "container py-4">
          <h1 className = "display-6 fw-bold mb-1">
            Environmental Data Monitor
          </h1>
          <p className = "text-muted mb-0">
            Real-time air quality and weather tracking
          </p>
        </div>
      </header>

      <main className = "container py-4">
        {selectedCity ? (
          <CityDashboard city = {selectedCity} onBack = {handleBack} />
        ) : (
          <CityList onCitySelect= {handleCitySelect} />
        )}
      </main>

      <footer className = "bg-white border-top mt-5">
        <div className = "container py-4 text-center text-muted small">
          Data & updates in real-time | Built with Django & React
        </div>
      </footer>
    </div>
  );
}

export default App;
