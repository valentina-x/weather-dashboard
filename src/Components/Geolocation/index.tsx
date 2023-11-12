import React from 'react';
import GeolocationStyles from './style.module.scss';

interface IGeolocationProps {
  className?: string;
  children: React.ReactNode;
  type: string;
  onChangeGeolocation: (geolocation: string) => void;
}

const Geolocation: React.FC<IGeolocationProps> = ({ className, children, onChangeGeolocation }) => {
  const onClickGeolocationHandler = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // OpenCage Geocoding API - используем полученные координаты для определения города
          const apiKey = '47720bb7b22b4f4d8fb4b29210eb2f4f';
          const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}&pretty=1`;

          fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              const city = data.results[0]?.components?.city;
              const state = data.results[0]?.components?.state;

              if (city) {
                onChangeGeolocation(city);
              } else {
                onChangeGeolocation(state);
              }
            })
            .catch((error) => {
              console.error('Error fetching user city:', error);
            });
        },
        (error) => {
          console.error('Не удалось получить ваше местоположение:', error);
          alert('Не удалось получить ваше местоположение. \nПроверьте разрешение в браузере.');
        },
      );
    }
  };

  return (
    <button className={className} onClick={onClickGeolocationHandler}>
      {children}
    </button>
  );
};

export { GeolocationStyles };
export default Geolocation;
