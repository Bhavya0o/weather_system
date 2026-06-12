import React from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function WeatherApp() {
  const [city, setCity] = React.useState("");
  const [weatherData, setWeatherData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const apikey = "5f114b623b2c42d49c3102625230807";

  React.useEffect(() => {
    document.body.classList.add("default");
    return () => {
      document.body.className = "";
    };
  }, []);

  const setWeatherBackground = (condition) => {
    document.body.className = "";
    const text = condition.toLowerCase();

    if (text.includes("sun")) {
      document.body.classList.add("sunny");
    } else if (text.includes("rain") || text.includes("drizzle") || text.includes("thunder")) {
      document.body.classList.add("rainy");
    } else if (text.includes("cloud") || text.includes("mist") || text.includes("fog") || text.includes("overcast")) {
      document.body.classList.add("cloudy");
    } else if (text.includes("clear")) {
      document.body.classList.add("clear");
    } else {
      document.body.classList.add("default");
    }
  };

  const fetchWeather = async (e) => {
    e?.preventDefault();

    const trimmed = city.trim();
    if (!trimmed) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const { data } = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${trimmed}&aqi=no`
      );
      setWeatherData(data);
      setWeatherBackground(data.current.condition.text);
    } catch (err) {
      const message =
        err.response?.status === 400
          ? "City not found. Please check the spelling and try again."
          : "Something went wrong. Please try again later.";
      setError(message);
      document.body.className = "default";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <span className="app-logo-icon" aria-hidden="true">🌤️</span>
          <h1 className="app-title">WeatherCast</h1>
        </div>
        <p className="app-subtitle">Real-time weather for any city worldwide</p>
      </header>

      <main className="app-main">
        <div className="weather-card">
          <form className="search-form" onSubmit={fetchWeather}>
            <label className="search-label" htmlFor="city-input">
              Search location
            </label>
            <div className="search-input-wrapper">
              <span className="search-icon" aria-hidden="true">
                <SearchIcon fontSize="inherit" />
              </span>
              <input
                id="city-input"
                type="text"
                name="city"
                className="search-input"
                placeholder="e.g. London, Tokyo, New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? "Checking…" : "Get Weather"}
            </button>
          </form>

          {loading && (
            <div className="loading-state" role="status" aria-live="polite">
              <div className="spinner" />
              <p className="loading-text">Fetching weather data…</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-message" role="alert">
              <ErrorOutlineIcon className="error-icon" fontSize="inherit" />
              <span>{error}</span>
            </div>
          )}

          {weatherData && !loading && (
            <div className="weather-result">
              <div className="weather-location">
                <LocationOnIcon fontSize="small" />
                <span>
                  {weatherData.location.name}, {weatherData.location.country}
                </span>
              </div>

              <div className="weather-hero">
                <img
                  src={`https:${weatherData.current.condition.icon}`}
                  className="weather-icon"
                  alt={weatherData.current.condition.text}
                />
                <span className="weather-temp">
                  {Math.round(weatherData.current.temp_c)}
                </span>
                <span className="weather-temp-unit">°C</span>
              </div>

              <p className="weather-condition">
                {weatherData.current.condition.text}
              </p>

              <div className="weather-stats">
                <div className="stat-item">
                  <span className="stat-icon" aria-hidden="true">🌡️</span>
                  <span className="stat-value">
                    {Math.round(weatherData.current.feelslike_c)}°
                  </span>
                  <span className="stat-label">Feels like</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon" aria-hidden="true">💧</span>
                  <span className="stat-value">
                    {weatherData.current.humidity}%
                  </span>
                  <span className="stat-label">Humidity</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon" aria-hidden="true">💨</span>
                  <span className="stat-value">
                    {weatherData.current.wind_kph}
                  </span>
                  <span className="stat-label">Wind km/h</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        Powered by WeatherAPI
      </footer>
    </div>
  );
}

export default WeatherApp;
