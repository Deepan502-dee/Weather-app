import './App.css';
import PropTypes from 'prop-types';
//Import Images
import Clear from './assests/clear.png'
import Cloud from './assests/cloud.png'
import Drizzle from './assests/drizzle.png'
import Rain from './assests/rain.png'
import Humidity from './assests/humidity.png'
import Search from './assests/search.png'
import Snow from './assests/snow.png'
import Wind from './assests/wind.png'
import { useEffect, useState } from 'react';

export const WeatherDetails = ({ icon, temp, city, country, lat, log, hum, wind }) => {
  return (
    <>
      <div className='images-details'>
        <img src={icon} className="climate-images" alt="climate-images" />
      </div>
      <div className='temp'>{temp} °C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <p>Latitude <span>{lat}</span></p>
        <p>Longitude <span>{log}</span></p>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={Humidity} alt="humidity" />
          <div className='humidity-number down1'>{hum}%</div>
          <div className='text down2'>Humidity</div>
        </div>
        <div className='element'>
          <img src={Wind} alt="humidity" />
          <div className='humidity-number down1'>{wind} Km/h</div>
          <div className='text down2'>Wind</div>
        </div>
      </div>
    </>
  )
};

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  hum: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired, 
};


export const Weather = () => {
  let api_key = '73ab2a5501642a00e8ba33ebeeaeb239'
  const [text, setText] = useState('London');
  const [loading, setLoading] = useState(false);
  const [notfound, setNotfound] = useState(false);
  const [error, setError] = useState();

  const [icon, setIcon] = useState(Rain);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [hum, setHum] = useState(0);
  const [wind, setWind] = useState(0);

  const weatherIconMap = {
    "01d": Clear,
    "01n": Clear,
    "02d": Cloud,
    "02n": Cloud,
    "03d": Drizzle,
    "03n": Drizzle,
    "04d": Drizzle,
    "04n": Drizzle,
    "09d": Rain,
    "09n": Rain,
    "10d": Rain,
    "10n": Rain,
    "13d": Snow,
    "13n": Snow
  }

  const handleCity = (e) => {
    setText(e.target.value)
  }

  const handleKeydown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  }

  useEffect(function () {
    search()
  }, [])

  async function search() {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`
    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === '404') {
        setLoading(false);
        setNotfound(true);
        return
      }
      else {
        setNotfound(false);
        setHum(data.main.humidity);
        setTemp(Math.floor(data.main.temp));
        setCity(data.name);
        setWind(data.wind.speed);
        setLat(data.coord.lat);
        setLog(data.coord.lon);
        setCountry(data.sys.country);
        const Weathercode = data.weather[0].icon;
        setIcon(weatherIconMap[Weathercode] || Clear);
      }
    } catch (error) {
      console.log(`An error occured ${error.messege}`)
      setError(error.messege);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" className='input-box' placeholder='enter city name' value={text} onChange={handleCity} onKeyDown={handleKeydown} />
          <img src={Search} alt="search" className='search-icon' onClick={search} />
        </div>
        {loading && <div className='loader common'></div>}
        {error && <div className='error common'>{error}</div>}
        {notfound && <div className='notfound common'>City not found</div>}
        {(!loading && !notfound) && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} hum={hum} wind={wind} />}
        <p className='copyright'>Designed by <span>Deepan</span></p>
      </div>
    </>
  );
  
}
