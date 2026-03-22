import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Хук для перехода по страницам
import { Card } from '../shared/ui/Card';

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 32px;
  color: #FFFFFF;
  margin-bottom: 40px;
`;

const GreenButton = styled.button`
  width: 425px; 
  height: 45px;
  background-color: #28A745; 
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer; 
  transition: background-color 0.2s ease; 

  &:hover {
    background-color: #218838; 
  }
`;

export const WelcomePage = () => {
  const navigate = useNavigate(); // Вызываем хук навигации

  // Функция, которая сработает по клику на кнопку
  const handleContinue = () => {
    navigate('/auth'); // Перекидываем пользователя на страницу авторизации
  };

  return (
    <Card>
      <Title>Заглушка</Title>
      <GreenButton onClick={handleContinue}>
        Продолжить
      </GreenButton>
    </Card>
  );
};