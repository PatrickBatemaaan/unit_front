import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as OpenEye } from '../widgets/icons/OpenEye.svg';
import { ReactComponent as CloseEye } from '../widgets/icons/CloseEye.svg';

// База всех скиллов для выпадающего списка
const ALL_SKILLS = [
  'Adobe Photoshop', 'C#', 'C++', 'Figma', 'JavaScript', 'Python', 
  'Java', 'PostgreSQL', 'GitHub', 'Spring Boot', 'Spring Security', 
  'Kafka', 'Docker', 'Git', 'React', 'TypeScript', 'Node.js', 'Go', 'UI/UX'
];

// ИКОНКИ
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A6A6A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CrossIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SmallCrossIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A6A6A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// ТУМБЛЕР
const Toggle = ({ isOn, handleToggle }) => (
  <div onClick={handleToggle} style={{
    width: '44px', height: '24px', background: isOn ? '#95E66B' : '#5C5C5C',
    borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.3s',
    display: 'flex', alignItems: 'center', flexShrink: 0
  }}>
    <div style={{
      width: '20px', height: '20px', background: 'white', borderRadius: '50%',
      position: 'absolute', left: isOn ? '22px' : '2px', transition: '0.3s'
    }} />
  </div>
);

// СТИЛИ ТУЛТИПА
const Tooltip = styled.div`
  position: absolute;
  ${props => props.$position === 'top' ? 'bottom: 100%;' : 'top: 100%;'}
  left: 0;
  transform: ${props => props.$position === 'top' ? 'translateY(-8px)' : 'translateY(8px)'};
  background-color: #282828; color: #FFFFFF; padding: 8px 12px; border-radius: 8px;
  font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 500;
  white-space: nowrap; z-index: 100; opacity: 0; visibility: hidden;
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease; pointer-events: none;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5);
  &::after {
    content: ''; position: absolute;
    ${props => props.$position === 'top' ? 'top: 100%;' : 'bottom: 100%;'}
    left: 10px; border-width: 5px; border-style: solid;
    border-color: ${props => props.$position === 'top' ? '#282828 transparent transparent transparent' : 'transparent transparent #282828 transparent'};
  }
`;

const IconWrapper = styled.div`
  position: relative; display: flex; align-items: center; justify-content: center; cursor: help;
  &:hover ${Tooltip} { opacity: 1; visibility: visible; transform: ${props => props.$position === 'top' ? 'translateY(-4px)' : 'translateY(4px)'}; }
`;

// ОСНОВНЫЕ СТИЛИ СТРАНИЦЫ
const PageWrapper = styled.div`
  display: flex; gap: 100px; padding: 40px; color: white; justify-content: center;
  font-family: 'Montserrat', sans-serif; overflow-x: hidden; width: 100%;
`;

const LeftColumn = styled.div` display: flex; flex-direction: column; gap: 20px; width: 535px; `;
const ActionHeader = styled.div` display: flex; justify-content: flex-end; gap: 16px; width: 100%; margin-bottom: 8px; `;
const ActionText = styled.span`
  font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 16px; letter-spacing: -0.03em;
  color: ${props => props.$color}; cursor: pointer; &:hover { opacity: 0.8; }
`;

const ContactRow = styled.div` display: flex; align-items: center; justify-content: space-between; width: 100%; height: 32px; `;
const ContactInfoWrapper = styled.div` display: flex; align-items: center; gap: 12px; `;
const LabelWrapper = styled.div`
  display: flex; align-items: center; gap: 8px; width: 110px; color: #A6A6A6; font-size: 16px;
  svg { width: 20px; height: 20px; flex-shrink: 0; }
`;

const EditableInput = styled.input`
  width: 280px; height: 28px; background: transparent; border: none; border-bottom: 1px solid #5C5C5C; 
  color: #FFFFFF; font-family: 'Montserrat', sans-serif; font-size: 16px; padding: 0 0 2px 0; outline: none; box-sizing: border-box;
  transition: border-bottom-color 0.2s; &:focus { border-bottom-color: #95E66B; }
`;

const StaticText = styled.div`
  width: 280px; height: 28px; font-size: 16px; display: flex; align-items: flex-end; 
  padding: 0 0 2px 0; border-bottom: 1px solid transparent; box-sizing: border-box;
`;
const HideText = styled.span` font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 16px; letter-spacing: -0.03em; color: #959595; `;

// СТИЛИ НАВЫКОВ 
const SkillsHeader = styled.div` display: flex; align-items: center; justify-content: space-between; margin-top: 24px; margin-bottom: 16px; `;
const SkillCard = styled.div`
  width: 100%; min-height: 80px; background: #282828; border: 1px solid #5C5C5C; border-radius: 8px;
  padding: 16px; display: flex; flex-direction: column; gap: 8px; box-sizing: border-box;
`;
const SkillLevel = styled.span` font-family: 'Montserrat', sans-serif; font-size: 16px; color: #959595; `;
const EmptySkillText = styled.span` font-family: 'Montserrat', sans-serif; font-size: 14px; color: #959595; `;
const TagsContainer = styled.div` display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; `;
const SkillTag = styled.div`
  background: #5C5C5C; color: #E3E3E3; padding: 6px 12px; border-radius: 16px; font-size: 12px;
  font-family: 'Montserrat', sans-serif; display: flex; align-items: center; gap: 6px;
  ${props => props.$editable && `cursor: pointer; &:hover { background: #FF4D4D; }`}
`;

// ПРОЕКТЫ (Правая часть) 
const ProjectsContainer = styled.div`
  width: 758px; height: 909px; background: #282828; border-radius: 20px;
  padding: 30px; display: flex; flex-direction: column; box-sizing: border-box;
`;
const ScrollWrapper = styled.div`
  flex: 1; width: 710px; overflow-y: auto; overflow-x: hidden; box-sizing: border-box; padding-right: 16px; margin-bottom: 24px;
  &::-webkit-scrollbar { width: 14px; }
  &::-webkit-scrollbar-thumb { background: #5C5C5C; border-radius: 8px; border: 4px solid #282828; }
`;
const ProjectsGrid = styled.div` width: 678px; display: grid; grid-template-columns: 329px 329px; gap: 31px 20px; box-sizing: border-box; `;
const ProjectCard = styled.div`
  width: 329px; height: 153px; border: 1px solid #5C5C5C; border-radius: 8px;
  padding: 16px; display: flex; flex-direction: column; justify-content: center; box-sizing: border-box;
`;
const Button = styled.button`
  width: 329px; height: 48px; border-radius: 8px; border: none; font-weight: 600; font-size: 16px; cursor: pointer;
  background: ${props => props.$primary ? '#95E66B' : 'transparent'};
  color: ${props => props.$primary ? '#000' : '#fff'};
  border: ${props => props.$primary ? 'none' : '1px solid #5C5C5C'};
`;

// РЕДАКТИРОВАНИЕ НАВЫКОВ 
const EditSkillsContainer = styled.div` width: 100%; max-width: 1000px; display: flex; flex-direction: column; gap: 24px; margin: 0 auto; `;
const EditSkillsHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; `;
const CloseBtn = styled.button` background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; &:hover { opacity: 0.7; }`;
const DashedInputContainer = styled.div` position: relative; width: max-content; margin-top: 8px; `;
const DashedInput = styled.div`
  display: flex; align-items: center; gap: 8px; padding: 6px 16px; border: 1px dashed #5C5C5C; border-radius: 20px;
  cursor: text; color: #A6A6A6; font-size: 12px;
  input { background: transparent; border: none; color: white; outline: none; font-family: 'Montserrat', sans-serif; font-size: 12px; width: 120px; }
`;
const DropdownMenu = styled.div`
  position: absolute; top: 100%; left: 0; margin-top: 8px; background: #5C5C5C; border-radius: 8px;
  padding: 8px 0; width: 200px; max-height: 200px; overflow-y: auto; z-index: 100;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5);
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #A6A6A6; border-radius: 4px; }
`;
const DropdownItem = styled.div` padding: 8px 16px; font-size: 14px; cursor: pointer; color: white; &:hover { background: #333333; } `;
const ConfirmButton = styled.button`
  align-self: center; width: 329px; height: 48px; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; margin-top: 24px; transition: 0.3s;
  background: ${props => props.$active ? '#95E66B' : 'transparent'};
  color: ${props => props.$active ? '#000' : '#5C5C5C'};
  border: 1px solid ${props => props.$active ? '#95E66B' : '#5C5C5C'};
`;

export const ProfilePage = () => {
  const navigate = useNavigate();

  // Состояния контактов
  const [emailVisible, setEmailVisible] = useState(true);
  const [tgVisible, setTgVisible] = useState(true);
  const [email, setEmail] = useState('coolbusinessman86@mail.ru');
  const [telegram, setTelegram] = useState('@coolid');
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [draftEmail, setDraftEmail] = useState('');
  const [draftTelegram, setDraftTelegram] = useState('');

  // Состояния навыков
  const [skills, setSkills] = useState({ high: [], medium: [], basic: ['Java', 'PostgreSQL', 'GitHub', 'Spring Boot', 'Spring Security', 'Kafka', 'Docker', 'Figma', 'Git'] });
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [draftSkills, setDraftSkills] = useState({ high: [], medium: [], basic: [] });
  const [activeSearchLevel, setActiveSearchLevel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const hasSkillChanges = JSON.stringify(skills) !== JSON.stringify(draftSkills);

  // Обработчики контактов
  const handleEditContact = () => { setDraftEmail(email); setDraftTelegram(telegram); setIsEditingContact(true); };
  const handleCancelContact = () => { setIsEditingContact(false); };
  const handleSaveContact = () => { setEmail(draftEmail); setTelegram(draftTelegram); setIsEditingContact(false); };

  // Обработчики навыков
  const openSkillsEdit = () => { setDraftSkills(JSON.parse(JSON.stringify(skills))); setIsEditingSkills(true); };
  const closeSkillsEdit = () => { setIsEditingSkills(false); setActiveSearchLevel(null); setSearchQuery(''); };
  const saveSkills = () => { if (hasSkillChanges) { setSkills(draftSkills); closeSkillsEdit(); } };

  const removeSkill = (level, skillToRemove) => { setDraftSkills(prev => ({ ...prev, [level]: prev[level].filter(s => s !== skillToRemove) })); };
  const addSkill = (level, newSkill) => { setDraftSkills(prev => ({ ...prev, [level]: [...prev[level], newSkill] })); setActiveSearchLevel(null); setSearchQuery(''); };

  const getFilteredSkills = (level) => ALL_SKILLS.filter(s => !draftSkills[level].includes(s) && s.toLowerCase().includes(searchQuery.toLowerCase()));

  // Рендер редактирования навыков
  if (isEditingSkills) {
    return (
      <PageWrapper style={{ flexDirection: 'column', alignItems: 'center' }}>
        <EditSkillsContainer>
          <EditSkillsHeader>
            <h1 style={{ margin: 0, fontSize: '32px' }}>Какими навыками владеете?</h1>
            <CloseBtn onClick={closeSkillsEdit}><CrossIcon /></CloseBtn>
          </EditSkillsHeader>
          {['high', 'medium', 'basic'].map((level) => {
            const levelNames = { high: 'Высокий уровень', medium: 'Средний уровень', basic: 'Базовый уровень' };
            const isActive = activeSearchLevel === level;
            return (
              <SkillCard key={level}>
                <SkillLevel>{levelNames[level]}</SkillLevel>
                <TagsContainer>
                  {draftSkills[level].map(skill => (
                    <SkillTag key={skill} $editable onClick={() => removeSkill(level, skill)}>{skill} <SmallCrossIcon /></SkillTag>
                  ))}
                </TagsContainer>
                <DashedInputContainer>
                  <DashedInput onClick={() => setActiveSearchLevel(level)}>
                    <SearchIcon /><input autoFocus={isActive} placeholder="Укажите навык" value={isActive ? searchQuery : ''} onChange={(e) => setSearchQuery(e.target.value)} onBlur={() => setTimeout(() => setActiveSearchLevel(null), 200)} />
                  </DashedInput>
                  {isActive && (
                    <DropdownMenu>
                      {getFilteredSkills(level).length > 0 ? getFilteredSkills(level).map(s => <DropdownItem key={s} onMouseDown={() => addSkill(level, s)}>{s}</DropdownItem>) : <div style={{ padding: '8px 16px', fontSize: '12px', color: '#A6A6A6' }}>Ничего не найдено</div>}
                    </DropdownMenu>
                  )}
                </DashedInputContainer>
              </SkillCard>
            );
          })}
          <ConfirmButton $active={hasSkillChanges} disabled={!hasSkillChanges} onClick={saveSkills}>Подтвердить</ConfirmButton>
        </EditSkillsContainer>
      </PageWrapper>
    );
  }

  // Основной рендер профиля
  return (
    <PageWrapper>
      <LeftColumn>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '122px', height: '122px', borderRadius: '50%', background: '#D9D9D9', flexShrink: 0 }} />
          <div>
            <h2 style={{ fontSize: '32px', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>Иванов Иван Иванович</h2>
            <div style={{ width: '104px', height: '33px', background: '#6D4583', borderRadius: '23px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>УрФУ</div>
          </div>
        </div>
        
        <ActionHeader>
          {isEditingContact ? (
            <>
              <ActionText $color="#959595" onClick={handleCancelContact}>Отмена</ActionText>
              <ActionText $color="#95E66B" onClick={handleSaveContact}>Сохранить</ActionText>
            </>
          ) : (
            <ActionText $color="#95E66B" onClick={handleEditContact}>Редактировать</ActionText>
          )}
        </ActionHeader>

        <ContactRow>
          <ContactInfoWrapper>
            <LabelWrapper>
              <IconWrapper $position="top">
                {emailVisible ? <OpenEye /> : <CloseEye />}
                <Tooltip $position="top">{emailVisible ? 'Ваша почта видна всем' : 'Почта скрыта'}</Tooltip>
              </IconWrapper>
              <span>Эл. почта:</span>
            </LabelWrapper>
            {isEditingContact ? <EditableInput value={draftEmail} onChange={(e) => setDraftEmail(e.target.value)} /> : <StaticText>{email}</StaticText>}
          </ContactInfoWrapper>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <HideText>Скрыть</HideText>
            <Toggle isOn={!emailVisible} handleToggle={() => setEmailVisible(!emailVisible)} />
          </div>
        </ContactRow>

        <ContactRow style={{ marginTop: '4px' }}>
          <ContactInfoWrapper>
            <LabelWrapper>
              <IconWrapper $position="bottom">
                {tgVisible ? <OpenEye /> : <CloseEye />}
                <Tooltip $position="bottom">{tgVisible ? 'Ваш Telegram виден всем' : 'Telegram скрыт'}</Tooltip>
              </IconWrapper>
              <span>Telegram:</span>
            </LabelWrapper>
            {isEditingContact ? <EditableInput value={draftTelegram} onChange={(e) => setDraftTelegram(e.target.value)} /> : <StaticText>{telegram}</StaticText>}
          </ContactInfoWrapper>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <HideText>Скрыть</HideText>
            <Toggle isOn={!tgVisible} handleToggle={() => setTgVisible(!tgVisible)} />
          </div>
        </ContactRow>

        <SkillsHeader>
          <h2 style={{ fontSize: '24px', margin: 0 }}>Навыки</h2>
          <ActionText $color="#95E66B" onClick={openSkillsEdit}>Редактировать</ActionText>
        </SkillsHeader>

        {['high', 'medium', 'basic'].map((level) => {
          const levelNames = { high: 'Высокий уровень', medium: 'Средний уровень', basic: 'Базовый уровень' };
          return (
            <SkillCard key={level}>
              <SkillLevel>{levelNames[level]}</SkillLevel>
              {skills[level].length > 0 ? (
                <TagsContainer>
                  {skills[level].map(skill => <SkillTag key={skill}>{skill}</SkillTag>)}
                </TagsContainer>
              ) : (
                <EmptySkillText>Вы не указали свои навыки</EmptySkillText>
              )}
            </SkillCard>
          );
        })}
      </LeftColumn>
      
      <ProjectsContainer>
        <h2 style={{ fontSize: '32px', margin: '0 0 24px 0' }}>Проекты</h2>
        <ScrollWrapper>
          <ProjectsGrid>
            {Array(16).fill(0).map((_, i) => (
              <ProjectCard key={i}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Лютое название</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#A6A6A6' }}>Мега-проект с чем-то там</p>
                <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#95E66B' }}>в разработке</p>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        </ScrollWrapper>
        <div style={{ display: 'flex', gap: '32px', marginTop: 'auto' }}>
          <Button $primary onClick={() => navigate('/404')}>Создать проект</Button>
          <Button onClick={() => navigate('/404')}>Найти проект</Button>
        </div>
      </ProjectsContainer>
    </PageWrapper>
  );
};