import React, { useState, useEffect } from 'react';
import DatePanelStyles from './style.module.scss';

interface IDatePanelProps {
  weatherData: any;
}

function getTime(timestamp: number, timezone: number): string {
  const dateTime = new Date((timestamp + timezone) * 1000);
  const hour = dateTime.getUTCHours().toString().padStart(2, '0');
  const minute = dateTime.getUTCMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

function getFormattedDate(timestamp: number) {
  const daysOfWeek = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ];
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  const date = new Date(timestamp * 1000);
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];

  return `${dayOfWeek}, ${dayOfMonth} ${month}`;
}

const DatePanel: React.FC<IDatePanelProps> = ({ weatherData }) => {
  const [formattedTime, setFormattedTime] = useState<any>(null);

  const timestamp = weatherData?.dt as number;
  const timezone = weatherData?.timezone as number;

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = Date.now() / 1000;
      setFormattedTime(getTime(timestamp, timezone));
    }, 1000);

    return () => clearInterval(interval);
  }, [weatherData]);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={DatePanelStyles.date}>
      <div className={DatePanelStyles.date__city}>{weatherData.name}</div>
      <div className={DatePanelStyles.date__time}>{formattedTime}</div>
      <div className={DatePanelStyles.date__day}>{getFormattedDate(timestamp)}</div>
    </div>
  );
};

export { DatePanelStyles };
export default DatePanel;
