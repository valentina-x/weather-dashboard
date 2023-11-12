import React from 'react';
import ToggleButtonsStyles from './style.module.scss';

interface IToggleButtonsProps {
  onChangeTypeWeather: (typeWeather: string) => void;
}

const ToggleButtons: React.FC<IToggleButtonsProps> = ({ onChangeTypeWeather }) => {
  const toggleClass = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    const buttons: NodeListOf<Element> = document.querySelectorAll(
      `.${ToggleButtonsStyles.buttons__button}`,
    );
    buttons.forEach((button) => {
      button.classList.remove(`${ToggleButtonsStyles.buttons__button_active}`);
    });
    if (target.classList.contains(`${ToggleButtonsStyles.buttons__button}`)) {
      target.classList.add(`${ToggleButtonsStyles.buttons__button_active}`);
    }
  };
  return (
    <div className={`${ToggleButtonsStyles.buttons}`}>
      <div
        className={`${ToggleButtonsStyles.buttons__button} ${ToggleButtonsStyles.buttons__button_active}`}
        onClick={(e) => {
          toggleClass(e);
          onChangeTypeWeather('forecast');
        }}
      >
        На сегодня
      </div>
      <div
        className={`${ToggleButtonsStyles.buttons__button}`}
        onClick={(e) => {
          toggleClass(e);
          onChangeTypeWeather('onecall');
        }}
      >
        На неделю
      </div>
    </div>
  );
};

export { ToggleButtonsStyles };
export default ToggleButtons;
