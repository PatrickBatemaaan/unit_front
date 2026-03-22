import { Outlet, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Header } from '../../widgets/Header/Header';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    background-color: #151515; 
    color: #FFFFFF; 
    font-family: 'Montserrat', sans-serif; 
    /* УБРАЛИ overflow-x: hidden, теперь браузер может скроллить! */
  }
`;

const LayoutWrapper = styled.div` 
  min-height: 100vh; 
  min-width: fit-content; /* Не дает странице сжаться меньше контента, спасая шапку */
  display: flex; 
  flex-direction: column; 
`;

const CenteredContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const BaseLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/auth' || location.pathname === '/verify';

  return (
    <LayoutWrapper>
      <GlobalStyle />
      <Header /> 
      {isAuthPage ? (
        <CenteredContent>
          <Outlet />
        </CenteredContent>
      ) : (
        <Outlet /> 
      )}
    </LayoutWrapper>
  );
};