import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  color: white;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
`;

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <h1>404</h1>
      <p>Страница еще не готова</p>
      <button onClick={() => navigate('/')}>На главную</button>
    </Container>
  );
};