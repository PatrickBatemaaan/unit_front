import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../shared/ui/Card';
import { ReactComponent as ArrowLeft } from '../widgets/icons/arrow-left.svg';
import { ReactComponent as TgBotArrow } from '../widgets/icons/TgBotArrow.svg';

const API_URL = 'http://localhost:5000'; // <--- ПОРТ БЭКЕНДА

const LABEL_COLOR = '#A6A6A6';
const ACTIVE_COLOR = '#95E66B';
const ERROR_COLOR = '#FF4D4D';

const ContentWrapper = styled.div` width: 100%; height: 100%; padding: 0 32px 32px 32px; display: flex; flex-direction: column; align-items: center; box-sizing: border-box; `;
const HeaderWrapper = styled.div` display: grid; grid-template-columns: 24px 1fr 24px; align-items: center; width: 100%; margin-bottom: 24px; `;
const BackButton = styled.button` background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; svg { width: 24px; height: 24px; stroke: #FFFFFF; } &:hover { opacity: 0.7; } `;
const Title = styled.h1` font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 24px; color: #FFFFFF; margin: 0; text-align: center; `;
const InfoText = styled.p` font-family: 'Montserrat', sans-serif; color: ${LABEL_COLOR}; font-size: 14px; margin-bottom: 32px; text-align: center; display: flex; align-items: center; gap: 6px; `;
const BotLink = styled.span` color: ${ACTIVE_COLOR}; cursor: pointer; display: flex; align-items: center; gap: 4px; &:hover { text-decoration: underline; } svg { width: 12px; height: 12px; stroke: ${ACTIVE_COLOR}; } `;
const CodeInputs = styled.div` display: flex; gap: 8px; margin-bottom: 12px; `;
const DigitInput = styled.input` width: 48px; height: 56px; background: #282828; border: 1px solid ${props => props.$isError ? ERROR_COLOR : '#5C5C5C'}; border-radius: 8px; color: white; text-align: center; font-size: 24px; font-family: 'Montserrat', sans-serif; outline: none; transition: border-color 0.2s; &:focus { border-color: #FFFFFF; } &:disabled { opacity: 0.5; cursor: not-allowed; } `;
const ErrorText = styled.div` color: ${ERROR_COLOR}; font-size: 12px; font-family: 'Montserrat', sans-serif; height: 16px; margin-bottom: 20px; width: 100%; text-align: center; `;
const VerifyButton = styled.button` width: 100%; height: 48px; border-radius: 8px; background-color: ${props => props.$isActive ? ACTIVE_COLOR : 'transparent'}; border: ${props => props.$isActive ? 'none' : '1px solid #5C5C5C'}; color: ${props => props.$isActive ? '#000000' : '#FFFFFF'}; font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 16px; cursor: ${props => props.$isActive ? 'pointer' : 'not-allowed'}; transition: all 0.3s ease; opacity: ${props => props.$isLoading ? 0.7 : 1}; `;

export const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputs = useRef([]);
  
  const userEmail = location.state?.userEmail || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isError, setIsError] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentCode = code.join('');
  const isCodeComplete = currentCode.length === 6;

  useEffect(() => {
    if (!userEmail) navigate('/auth');
  }, [userEmail, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setIsError(false);
    setServerErrorMessage('');
    if (value && index < 5) inputs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    if (!isCodeComplete) return;

    setIsLoading(true);
    setIsError(false);
    setServerErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/api/account/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ email: userEmail, code: currentCode })
      });

      if (response.ok) {
        navigate('/profile');
      } else {
        const errorData = await response.json();
        setIsError(true);
        setServerErrorMessage(errorData.detail || 'Неверный код или почта');
      }
    } catch (error) {
      setIsError(true);
      setServerErrorMessage('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <ContentWrapper>
        <HeaderWrapper>
          <BackButton onClick={() => navigate('/auth')}><ArrowLeft /></BackButton>
          <Title>Введите код</Title>
          <div />
        </HeaderWrapper>

        <InfoText>
          Получите код в нашем <BotLink onClick={() => navigate('/404')}>боте в Телеграм <TgBotArrow /></BotLink>
        </InfoText>

        <CodeInputs>
          {code.map((digit, i) => (
            <DigitInput key={i} maxLength="1" value={digit} $isError={isError} disabled={isLoading} ref={el => inputs.current[i] = el} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} />
          ))}
        </CodeInputs>

        <ErrorText>{serverErrorMessage}</ErrorText>

        <VerifyButton $isActive={isCodeComplete && !isLoading} $isLoading={isLoading} disabled={!isCodeComplete || isLoading} onClick={handleVerify}>
          {isLoading ? 'Проверка...' : 'Войти'}
        </VerifyButton>
      </ContentWrapper>
    </Card>
  );
};