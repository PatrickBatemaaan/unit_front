import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Card } from '../shared/ui/Card';

const LABEL_COLOR = '#A6A6A6';
const ACTIVE_COLOR = '#95E66B';
const ERROR_COLOR = '#FF4D4D';

const ContentWrapper = styled.div`
  width: 100%; height: 100%; padding: 0 32px 32px 32px; display: flex;
  flex-direction: column; box-sizing: border-box;
`;

const HeaderWrapper = styled.div`
  display: grid; grid-template-columns: 24px 1fr 24px; align-items: center;
  width: 100%; margin-bottom: 40px;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 24px;
  color: #FFFFFF; margin: 0; text-align: center;
`;

const CloseButton = styled.button`
  background: none; border: none; cursor: pointer; padding: 0; display: flex;
  justify-content: center; align-items: center;
  svg { stroke: ${LABEL_COLOR}; stroke-width: 1.5; width: 24px; height: 24px; }
  &:hover { opacity: 0.7; }
`;

const InputWrapper = styled.div` display: flex; flex-direction: column; gap: 8px; width: 100%; `;

const Label = styled.label` font-family: 'Montserrat', sans-serif; font-size: 16px; color: ${LABEL_COLOR}; `;

const StyledInput = styled.input`
  width: 100%; height: 45px; border-radius: 8px;
  border: 1px solid ${props => props.$hasError ? ERROR_COLOR : '#5C5C5C'};
  background-color: transparent; color: #FFFFFF; padding: 0 16px; box-sizing: border-box;
  font-family: 'Montserrat', sans-serif; font-size: 16px; outline: none; transition: border-color 0.2s;
  &:focus { border-color: #FFFFFF; }
`;

const ErrorText = styled.span`
  color: ${ERROR_COLOR}; font-size: 12px; font-family: 'Montserrat', sans-serif;
  height: 16px; margin-top: 4px;
`;

const AuthButton = styled.button`
  width: 100%; height: 48px; border-radius: 8px;
  border: ${props => props.$isActive ? 'none' : '1px solid #5C5C5C'};
  background-color: ${props => props.$isActive ? ACTIVE_COLOR : 'transparent'};
  color: ${props => props.$isActive ? '#000000' : '#FFFFFF'};
  font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 16px;
  cursor: ${props => props.$isActive ? 'pointer' : 'not-allowed'};
  transition: all 0.3s ease; margin-top: auto;
`;

const FooterWrapper = styled.div`
  display: flex; justify-content: space-between; width: 100%; margin-top: 16px;
  font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 400; color: #FFFFFF; line-height: 100%;
`;

const RegisterLink = styled.span`
  color: ${ACTIVE_COLOR}; cursor: pointer; font-family: 'Montserrat', sans-serif;
  font-size: 12px; font-weight: 400; &:hover { text-decoration: underline; }
`;

export const AutorisationPage = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);

  const handleBlur = () => {
    if (email !== '' && !validateEmail(email)) setShowError(true);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setShowError(false);
    setIsValid(validateEmail(value));
  };

  return (
    <Card>
      <ContentWrapper>
        <HeaderWrapper>
          <div />
          <Title>Войти в аккаунт</Title>
          <CloseButton onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24" fill="none" stroke={LABEL_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6L18 18" />
            </svg>
          </CloseButton>
        </HeaderWrapper>
        
        <InputWrapper>
          <Label>Электронная почта</Label>
          <StyledInput 
            type="text" 
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            $hasError={showError}
            placeholder="example@mail.ru"
          />
          <ErrorText>{showError ? "Неверный формат почты" : ""}</ErrorText>
        </InputWrapper>

        <AuthButton 
          $isActive={isValid} 
          onClick={() => navigate('/verify', { state: { userEmail: email } })}
          disabled={!isValid}
        >
          Войти
        </AuthButton>

        <FooterWrapper>
          <span>Еще не зарегистрированы?</span>
          <RegisterLink onClick={() => navigate('/404')}>Создать аккаунт</RegisterLink>
        </FooterWrapper>
      </ContentWrapper>
    </Card>
  );
};