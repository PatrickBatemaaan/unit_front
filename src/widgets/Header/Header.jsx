import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

import { ReactComponent as UnitLogo } from '../../widgets/icons/UnitLogo.svg';
import { ReactComponent as LetterU } from '../../widgets/icons/u.svg';
import { ReactComponent as LetterN } from '../../widgets/icons/N.svg';
import { ReactComponent as LetterI } from '../../widgets/icons/I.svg';
import { ReactComponent as LetterT } from '../../widgets/icons/T.svg';
import { ReactComponent as ProfileDrop } from '../../widgets/icons/ProfileDrop.svg';

const API_URL = 'http://localhost:5000'; // <--- ПОРТ БЭКЕНДА

const HeaderContainer = styled.header` width: 100%; height: 64px; background-color: #282828; display: flex; justify-content: center; font-family: 'Montserrat', sans-serif; color: #FFFFFF; `;
const HeaderInner = styled.div` width: 100%; max-width: 1440px; height: 100%; position: relative; `;

const LogoGroup = styled.div` position: absolute; left: 304px; top: 12px; display: flex; align-items: flex-start; gap: 17px; cursor: pointer; `;
const StyledLogo = styled(UnitLogo)` width: 35px; height: 40px; `;
const LettersWrapper = styled.div` display: flex; align-items: center; gap: 4.5px; margin-top: 11px; `;
const StyledU = styled(LetterU)`width: 23.65px; height: 17.74px;`;
const StyledN = styled(LetterN)`width: 16.66px; height: 17.75px;`;
const StyledI = styled(LetterI)`width: 16.66px; height: 17.74px;`;
const StyledT = styled(LetterT)`width: 16.66px; height: 17.75px;`;

const Nav = styled.nav` position: absolute; left: 50%; top: 22px; transform: translateX(-50%); display: flex; gap: 40px; `;
const NavItem = styled.span` font-weight: 500; font-size: 16px; cursor: pointer; transition: color 0.2s; &:hover { color: #95E66B; } `;

const UserGroup = styled.div` position: absolute; right: 304px; top: 12px; display: flex; align-items: center; gap: 12px; cursor: pointer; `;
const Avatar = styled.div` width: 40px; height: 40px; border-radius: 50%; background-color: #D9D9D9; `;

const DropdownMenu = styled.div` position: absolute; top: 50px; right: 0; background: #5C5C5C; border-radius: 8px; padding: 8px 0; width: 150px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5); z-index: 100; `;
const DropdownItem = styled.div` padding: 8px 16px; font-size: 14px; color: white; &:hover { background: #333333; } `;

const AuthButton = styled.button` position: absolute; right: 304px; top: 12px; background-color: #95E66B; color: #000; border: none; padding: 0 24px; height: 40px; border-radius: 8px; font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 16px; cursor: pointer; transition: opacity 0.2s; &:hover { opacity: 0.8; } `;

export const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/' || location.pathname === '/auth' || location.pathname === '/verify';

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await fetch(`${API_URL}/api/account/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('Logout error', e);
    }
    navigate('/');
  };

  return (
    <HeaderContainer>
      <HeaderInner>
        <LogoGroup onClick={() => navigate('/')}>
          <StyledLogo />
          <LettersWrapper><StyledU /><StyledN /><StyledI /><StyledT /></LettersWrapper>
        </LogoGroup>

        {!isAuthPage && (
          <Nav>
            <NavItem onClick={() => navigate('/profile')}>Профиль</NavItem>
            <NavItem onClick={() => navigate('/404')}>Участники</NavItem>
            <NavItem onClick={() => navigate('/404')}>Проекты</NavItem>
          </Nav>
        )}

        {isAuthPage ? (
          <AuthButton onClick={() => navigate('/auth')}>Войти</AuthButton>
        ) : (
          <UserGroup onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Avatar /><ProfileDrop />
            {isDropdownOpen && (
              <DropdownMenu>
                <DropdownItem onClick={() => navigate('/profile')}>Мой профиль</DropdownItem>
                <DropdownItem onClick={handleLogout}>Выйти</DropdownItem>
              </DropdownMenu>
            )}
          </UserGroup>
        )}
      </HeaderInner>
    </HeaderContainer>
  );
};