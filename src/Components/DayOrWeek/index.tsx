import React, { useState, useEffect } from 'react';
import DayOrWeekStyles from './style.module.scss';
import wind from '../../Assets/images/wind.png';
import ToggleButtons from '../ToggleButtons';
import axios from 'axios';
import config from '../../Config/config';
import API_URL from '../../Middleware/api';

interface IDayOrWeekProps {
  weatherData: any;
}

interface IWeatherItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

function getTime(timestamp: number, timezone: number): string {
  const dateTime = new Date((timestamp + timezone) * 1000);
  const hour = dateTime.getUTCHours().toString().padStart(2, '0');
  const minute = dateTime.getUTCMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

const DayOrWeek: React.FC<IDayOrWeekProps> = ({ weatherData }) => {
  if (!weatherData) {
    return <div>Loading...</div>;
  }
  const [dayWeather, setDayWeather] = useState<any>([]);
  const [weekWeather, setWeekWeather] = useState<any>([]);
  const [typeWeather, setTypeWeather] = useState<string>('forecast');

  const api_custom_url = `${API_URL}forecast?appid=${config.appid}&lang=${config.lang}&units=${config.units}&q=${weatherData?.name}`;

  const onChangeTypeWeather = (typeWeather: string) => {
    setTypeWeather(typeWeather);
  };

  const groupByDay = (list: IWeatherItem[]) => {
    const grouped: { [key: string]: IWeatherItem[] } = {};
    const weekdays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    weekdays.forEach((day) => {
      grouped[day] = [];
    });

    list.forEach((item, index) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });

      if (weekdays.includes(day)) {
        grouped[day].push(item);
      }
    });

    return grouped;
  };

  // запрос "на день"
  useEffect(() => {
    axios
      .get(api_custom_url)
      .then((response) => {
        setDayWeather(response.data.list.slice(0, 8));
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, [weatherData]);

  // запрос "на неделю"
  useEffect(() => {
    axios
      .get(api_custom_url)
      .then((response) => {
        const groupedByDay = groupByDay(response.data.list);
        setWeekWeather(groupedByDay);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, [weatherData, typeWeather]);

  return (
    <>
      <ToggleButtons onChangeTypeWeather={onChangeTypeWeather} />
      <div className={`${DayOrWeekStyles.container}`}>
        {typeWeather === 'forecast' &&
          dayWeather &&
          Object.values(dayWeather)
            .flat()
            .map((item: any, index: number) => {
              const time = getTime(item.dt, weatherData.timezone);
              const isNight =
                parseInt(time.split(':')[0], 10) >= 21 || parseInt(time.split(':')[0], 10) < 6;

              return (
                <div
                  className={`${DayOrWeekStyles.item} ${isNight ? DayOrWeekStyles.item_night : ''}`}
                  key={index}
                >
                  <div className={DayOrWeekStyles.item__time}>
                    {getTime(item.dt, weatherData.timezone)}
                  </div>
                  <div className={DayOrWeekStyles.item__img}>
                    {item.weather && item.weather[0] && (
                      <img
                        src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`}
                        alt='img'
                      />
                    )}
                  </div>
                  <div className={DayOrWeekStyles.item__temp}>
                    {Math.round(item.main && item.main.temp)}°
                    <span>{item.weather[0].description}</span>
                  </div>
                  <div className={DayOrWeekStyles.item__wind}>
                    <img
                      src={wind}
                      alt='sky'
                      style={{ transform: `rotate(${item.wind && item.wind.deg}deg)` }}
                    />
                    <span>{Math.round(item.wind && item.wind.speed)} м/с</span>
                  </div>
                </div>
              );
            })}
        {typeWeather === 'onecall' &&
          weekWeather &&
          Object.keys(weekWeather).map((dayOfWeek) => {
            const dayData = weekWeather[dayOfWeek];
            if (dayData && dayData[0]) {
              const day = new Date(dayData[0].dt * 1000).toLocaleDateString('ru-RU', {
                weekday: 'long',
              });

              return (
                <div
                  key={dayOfWeek}
                  className={`${DayOrWeekStyles.item} ${DayOrWeekStyles.item_day}`}
                >
                  <div className={DayOrWeekStyles.item__day}>{day}</div>
                  <div className={DayOrWeekStyles.item__img}>
                    {dayData[0].weather && dayData[0].weather[0] && (
                      <img
                        src={`http://openweathermap.org/img/w/${dayData[0].weather[0].icon}.png`}
                        alt='img'
                      />
                    )}
                  </div>
                  <div className={DayOrWeekStyles.item__temp}>
                    {Math.round(dayData[0].main && dayData[0].main.temp)}°
                    <span>{dayData[0].weather[0].description}</span>
                  </div>
                  <div className={DayOrWeekStyles.item__wind}>
                    <img
                      src={wind}
                      alt='sky'
                      style={{ transform: `rotate(${dayData[0].wind && dayData[0].wind.deg}deg)` }}
                    />
                    <span>{Math.round(dayData[0].wind && dayData[0].wind.speed)} м/с</span>
                  </div>
                </div>
              );
            }
            return null;
          })}
      </div>
    </>
  );
};

export { DayOrWeekStyles };
export default DayOrWeek;
