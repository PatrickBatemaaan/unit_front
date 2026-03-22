import { useState } from 'react';
import styled from 'styled-components';
// Импортируем обе иконки котика
import { ReactComponent as CatIcon } from '../widgets/icons/Cat404.svg';
import { ReactComponent as CatIconClick } from '../widgets/icons/Cat404click.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding-top: 100px;
  font-family: 'Montserrat', sans-serif;
  text-align: center;
  box-sizing: border-box;
`;

// Огромные цифры 404
const ErrorCode = styled.h1`
  font-weight: 300;
  font-size: 256px;
  line-height: 100%;
  color: #95E66B;
  margin: 0;
  padding: 0;
`;

// Текст с фразой про котика
const ErrorText = styled.div`
  width: 540px;
  font-weight: 600;
  font-size: 28px;
  line-height: 120%;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  margin-top: 60px;
`;

const Line = styled.span`
  display: block;
`;

// Стилизованный контейнер для иконки котика
const CatWrapper = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer; /* Делаем курсор "пальчиком", чтобы юзер понял, что кота можно гладить */
  user-select: none; /* Чтобы при частых кликах картинка не выделялась синим */

  svg {
    width: auto;
    height: auto;
    max-width: 400px;
    transition: transform 0.1s ease; /* Добавим микро-эффект нажатия */
  }

  &:active svg {
    transform: scale(0.98); /* Котик чуть сжимается при нажатии */
  }
`;

export const NotFoundPage = () => {
  // Состояние: поглажен котик или нет
  const [isPetted, setIsPetted] = useState(false);

  const handlePetCat = () => {
    setIsPetted(!isPetted); // Меняем состояние на противоположное при каждом клике
  };

  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      
      <ErrorText>
        <Line>Такой страницы нет</Line>
        <Line>Зато есть котик, его можно погладить</Line>
      </ErrorText>

      <CatWrapper onClick={handlePetCat}>
        {/* Если isPetted === true, показываем CatIconClick, иначе — обычного кота */}
        {isPetted ? <CatIconClick /> : <CatIcon />}
      </CatWrapper>
    </Container>
  );
};