import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../../Middleware/api';
import config from '../../Config/config';

import styles from './style.module.scss';
/* types data form */
import SearchFields from './types';

interface ISearchProps {
  onSearchCity: (city: string) => void;
}

export default function SearchHistory({ onSearchCity }: ISearchProps) {
  const [value, setValue] = useState<string>('');
  const [searchErrors, setSearchErrors] = useState<
    Record<string, { message: string; hasError: boolean }>
  >({
    search: { message: 'Проверьте корректность введенных данных', hasError: false },
  });

  const handleSearchValue = (e: any) => {
    const value = e.target.value;
    setValue(value);

    if (value.trim() === '' && value.length > 0) {
      setSearchErrors((prevErrors) => ({
        ...prevErrors,
        search: { message: '', hasError: false },
      }));
    }
  };

  const validateForm = (formData: SearchFields) => {
    let isValid = true;
    const newErrors = { ...formErrors };

    if (formData.search.trim() === '') {
      newErrors.search = { message: 'Это поле обязательно', hasError: true };
      isValid = false;
    } else {
      newErrors.search = { message: '', hasError: false };
    }

    setFormErrors(newErrors);
    return isValid;
  };

  async function checkCityValidity(cityName: string) {
    try {
      const response = await axios.get(
        `${API_URL}${config.type}?appid=${config.appid}&lang=${config.lang}&units=${config.units}&q=${cityName}`,
      );
      const data = response.data;
      if (data && data.name) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking city validity:', error);
      return false;
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const city = formData.get('search') as string;

    const data: SearchFields = {
      search: formData.get('search') as string,
    };

    const isValid = validateForm(data);
    const isValidCity = await checkCityValidity(city);

    if (isValidCity) {
      setSearchErrors((prevErrors) => ({
        ...prevErrors,
        search: { message: '', hasError: false },
      }));
    } else {
      setSearchErrors((prevErrors) => ({
        ...prevErrors,
        search: { message: 'Неправильно указан город.', hasError: true },
      }));
    }

    if (isValid && isValidCity) {
      onSearchCity(city);
    } else {
      console.log('Отправка формы не удалась из-за ошибок проверки');
    }
  };

  const [formErrors, setFormErrors] = useState<
    Record<string, { message: string; hasError: boolean }>
  >({
    search: { message: 'Укажите город', hasError: false },
  });

  return (
    <form onSubmit={handleSubmit} className={styles.search}>
      <label htmlFor='search'>
        <button type='submit'>
          <svg>
            <use xlinkHref='#s_search'></use>
          </svg>
        </button>
        <input
          type='text'
          name='search'
          id='search'
          placeholder='Введите название города'
          onChange={handleSearchValue}
          autoComplete='off'
        />
      </label>
      {searchErrors.search.hasError && (
        <div className={`${styles.error} ${styles.error_pos} ${styles.error_text}`}>
          {searchErrors.search.message}
        </div>
      )}
    </form>
  );
}
