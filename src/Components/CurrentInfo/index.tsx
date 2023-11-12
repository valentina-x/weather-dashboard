import React, { useEffect, useState } from 'react';
import CurrentInfoStyles from './style.module.scss';
import { API_URL_IMG } from '../../Middleware/api';

interface ICurrentInfoProps {
  weatherData: any;
}

function getTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

const CurrentInfo: React.FC<ICurrentInfoProps> = ({ weatherData }) => {
  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const sunrise = getTime(weatherData?.sys?.sunrise);
  const sunset = getTime(weatherData?.sys?.sunset);

  const temp = Math.round(weatherData?.main?.temp);
  const temperatureSign = temp > 0 ? '+' : '';

  const feelsLike = Math.round(weatherData?.main?.feels_like);
  const feelsLikeSign = feelsLike > 0 ? '+' : '';

  const pressureInHpa = Math.round(weatherData?.main?.pressure);
  const pressureInMmHg = Math.round(pressureInHpa * 0.75006);

  return (
    <div className={CurrentInfoStyles.currentinfo}>
      <div className={CurrentInfoStyles.currentinfo__weather}>
        <img src={`${API_URL_IMG}${weatherData?.weather[0]?.icon}.png`} alt='img' />
        <span>{`${weatherData?.weather[0]?.description}`}</span>
      </div>
      <div className={CurrentInfoStyles.currentinfo__column}>
        <div className={CurrentInfoStyles.currentinfo__row}>
          <div className={CurrentInfoStyles.currentinfo__tempblock}>
            <div className={CurrentInfoStyles.currentinfo__temp}>
              {`${temperatureSign}${temp}`}°
            </div>
            <div className={CurrentInfoStyles.currentinfo__feellike}>
              Ощущается как: <span>{`${feelsLikeSign}${feelsLike}`}°</span>
            </div>
          </div>

          <div className={CurrentInfoStyles.currentinfo__suninfoblock}>
            <div className={CurrentInfoStyles.currentinfo__suninfo}>
              <svg>
                <use xlinkHref='#s_sunrise'></use>
              </svg>
              <div>
                <span>Восход</span>
                {sunrise}
              </div>
            </div>
            <div className={CurrentInfoStyles.currentinfo__suninfo}>
              <svg>
                <use xlinkHref='#s_sunset'></use>
              </svg>
              <div>
                <span>Закат</span>
                {sunset}
              </div>
            </div>
          </div>
        </div>
        <div className={CurrentInfoStyles.currentinfo__row}>
          <div className={CurrentInfoStyles.currentinfo__item}>
            <svg>
              <use xlinkHref='#s_humidity'></use>
            </svg>
            <div className={CurrentInfoStyles.currentinfo__item_info}>
              {`${weatherData?.main?.humidity}`}%
            </div>
            <div className={CurrentInfoStyles.currentinfo__item_title}>Влажность</div>
          </div>
          <div className={CurrentInfoStyles.currentinfo__item}>
            <svg>
              <use xlinkHref='#s_wind'></use>
            </svg>
            <div className={CurrentInfoStyles.currentinfo__item_info}>
              {`${Math.round(weatherData?.wind?.speed)}`} м/с
            </div>
            <div className={CurrentInfoStyles.currentinfo__item_title}>Скорость ветра</div>
          </div>
          <div className={CurrentInfoStyles.currentinfo__item}>
            <svg>
              <use xlinkHref='#s_pressure'></use>
            </svg>
            <div className={CurrentInfoStyles.currentinfo__item_info}>
              {`${pressureInMmHg}`} мм рт. ст.
            </div>
            <div className={CurrentInfoStyles.currentinfo__item_title}>Давление</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CurrentInfoStyles };
export default CurrentInfo;
