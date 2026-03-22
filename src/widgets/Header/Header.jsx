import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as UnitLogo } from '../../widgets/icons/UnitLogo.svg';

const HeaderContainer = styled.header`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  background-color: #151515;
  border-bottom: 1px solid #282828;
  color: #FFFFFF;
  font-family: 'Montserrat', sans-serif;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  svg { width: 41px; height: 41px; } /* Размеры из Фигмы */
`;

const LogoText = styled.span`
  font-weight: 400;
  font-size: 20px; /* Поправил размер */
`;

const Nav = styled.nav`
  display: flex;
  gap: 40px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%); /* Центрируем меню */
`;

const NavItem = styled.span`
  cursor: pointer;
  font-size: 16px;
  &:hover { color: #95E66B; }
`;

const AuthButton = styled.button`
  background-color: #95E66B;
  color: #000;
  border: none;
  padding: 8px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/auth';

  return (
    <HeaderContainer>
      <LogoWrapper onClick={() => navigate('/')}>
        <UnitLogo />
        <LogoText>ЮНИТ</LogoText>
      </LogoWrapper>
      
      {!isAuthPage && (
        <Nav>
          <NavItem onClick={() => navigate('/profile')}>Профиль</NavItem>
          <NavItem>Участники</NavItem>
          <NavItem>Проекты</NavItem>
        </Nav>
      )}

      {isAuthPage ? (
        <AuthButton onClick={() => navigate('/auth')}>Войти</AuthButton>
      ) : (
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#5C5C5C' }} />
      )}
    </HeaderContainer>
  );
};