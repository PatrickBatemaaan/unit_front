import { Outlet } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Header } from '../../widgets/Header/Header';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: #151515; color: #FFFFFF; font-family: 'Montserrat', sans-serif; }
`;

const LayoutWrapper = styled.div` 
  min-height: 100vh; 
  display: flex; 
  flex-direction: column; 
`;

// занимает всё свободное место под шапкой и центрирует контент внутри себя
const MainWrapper = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const BaseLayout = () => {
  return (
    <LayoutWrapper>
      <GlobalStyle />
      <Header /> 
      <MainWrapper>
        <Outlet />
      </MainWrapper>
    </LayoutWrapper>
  );
};;