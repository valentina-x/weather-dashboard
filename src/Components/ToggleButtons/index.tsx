import React, { useEffect, useRef, useState } from 'react';
import ToggleButtonsStyles from './style.module.scss';

interface IToggleButtonsProps {
  onChangeTypeWeather: (typeWeather: string) => void;
}

interface IButtonWeather {
  className: string;
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}

const ToggleButtons: React.FC<IToggleButtonsProps> = ({ onChangeTypeWeather }) => {
  const [activeButton, setActiveButton] = useState<string>('forecast');

  const ButtonWeather: React.FC<IButtonWeather> = ({ className, children, onClick, isActive }) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleButtonClick = () => {
      if (buttonRef.current) {
        const buttons = document.querySelectorAll(`.${ToggleButtonsStyles.buttons__button}`);
        buttons.forEach((btn) => btn.classList.remove(`${ToggleButtonsStyles.buttons__button_active}`));
        buttonRef.current.classList.add(`${ToggleButtonsStyles.buttons__button_active}`);
      }
      setActiveButton(activeButton === 'forecast' ? 'onecall': 'forecast');
      if (onClick) {
        onClick();
      }
    };

    return (
      <button
        type='button'
        className={`${className} ${isActive ? ToggleButtonsStyles.buttons__button_active : ''}`}
        ref={buttonRef}
        onClick={handleButtonClick}
      >
        {children}
      </button>
    );
  };

  return (
    <div className={`${ToggleButtonsStyles.buttons}`}>
      <ButtonWeather
        className={`${ToggleButtonsStyles.buttons__button} ${activeButton === 'forecast' ? ToggleButtonsStyles.buttons__button_active : ''}`}
        onClick={() => onChangeTypeWeather('forecast')}
        isActive={activeButton === 'forecast'}
      >
        На сегодня
      </ButtonWeather>
      <ButtonWeather
        className={`${ToggleButtonsStyles.buttons__button}`}
        onClick={() => onChangeTypeWeather('onecall')}
        isActive={activeButton === 'onecall'}
      >
        На неделю
      </ButtonWeather>
    </div>
  );
};

export { ToggleButtonsStyles };
export default ToggleButtons;
