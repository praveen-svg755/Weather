import React, { useEffect, useState } from 'react';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (city) => {
    if (!city) return;
    setLoading(true);
    setError(null);
    setSuggestions([]); // Clear suggestions after selecting a city

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('City not found');

      const data = await response.json();
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.ceil(data.main.temp),
        location: data.name,
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      });
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.map((city) => city.name));
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  useEffect(() => {
    search('London');
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Enter city..." 
          value={city} 
          onChange={(e) => {
            setCity(e.target.value);
            fetchSuggestions(e.target.value);
          }}
        />
        <button className="search" onClick={() => search(city)}>Search</button>
      </div>

      {/* City Suggestions */}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li key={index} onMouseDown={() => {
              setCity(suggestion);
              search(suggestion);
            }}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weatherData && (
        <>
          <div className="weather-image">
            <img src={weatherData.icon} alt="Weather icon" />
          </div>
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-details">
            <div className="humidity">
              <p>Humidity: {weatherData.humidity}%</p>
            </div>
            <div className="wind-speed">
              <p>Wind Speed: {weatherData.windSpeed} Km/h</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
