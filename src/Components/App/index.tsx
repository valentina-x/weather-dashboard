import React, { useEffect, useState } from 'react';
import AppStyles from './style.module.scss';
import sky from '../../Assets/images/sky.jpg';

import SearchForm from '../Search';
import SearchFields from '../Search/types';

import Geolocation, { GeolocationStyles } from '../Geolocation';
import DatePanel from '../DatePanel';
import CurrentInfo from '../CurrentInfo';
import DayOrWeek from '../DayOrWeek';
import axios from 'axios';
import API_URL from '../../Middleware/api';
import config from '../../Config/config';

function App() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [geoCity, setGeoCity] = useState('');

  useEffect(() => {
    const defaultCity = 'Москва';
    setGeoCity(defaultCity);
    axios
      .get(
        `${API_URL}${config.type}?appid=${config.appid}&lang=${config.lang}&units=${config.units}&q=${defaultCity}`,
      )
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, []);

  const onSearchCity = (city: string) => {
    setGeoCity(city);
    axios
      .get(
        `${API_URL}${config.type}?appid=${config.appid}&lang=${config.lang}&units=${config.units}&q=${city}`,
      )
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const onChangeGeolocation = (geolocation: string) => {
    setGeoCity(geolocation);
    axios
      .get(
        `${API_URL}${config.type}?appid=${config.appid}&lang=${config.lang}&units=${config.units}&q=${geolocation}`,
      )
      .then((response) => {
        if (geoCity == geolocation) {
          alert('Ваше местоположение уже активно. \nПовторное получение невозможно.');
        } else {
          setWeatherData(response.data);
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  return (
    <div className={AppStyles.app}>
      <div className={AppStyles.app__bg}>
        <img src={sky} alt='sky' />
      </div>
      <div className={AppStyles.app__container}>
        <SearchForm onSearchCity={onSearchCity} />
        <Geolocation
          className={GeolocationStyles.geolocation}
          type='button'
          onChangeGeolocation={onChangeGeolocation}
        >
          Текущая геолокация
        </Geolocation>
        <DatePanel weatherData={weatherData} />
        <CurrentInfo weatherData={weatherData} />
        <DayOrWeek weatherData={weatherData} />
      </div>
    </div>
  );
}

export default App;
