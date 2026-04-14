import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as OpenEye } from '../widgets/icons/OpenEye.svg';
import { ReactComponent as CloseEye } from '../widgets/icons/CloseEye.svg';
import { ReactComponent as InfoIcon } from '../widgets/icons/Info.svg';

const API_URL = 'http://localhost:5000'; 

const ALL_SKILLS = [
  'Adobe Photoshop', 'C#', 'C++', 'Figma', 'JavaScript', 'Python', 
  'Java', 'PostgreSQL', 'GitHub', 'Spring Boot', 'Spring Security', 
  'Kafka', 'Docker', 'Git', 'React', 'TypeScript', 'Node.js', 'Go', 'UI/UX'
];

const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A6A6A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const CrossIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SmallCrossIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A6A6A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const Toggle = ({ isOn, handleToggle }) => (
  <div onClick={handleToggle} style={{ width: '44px', height: '24px', background: isOn ? '#95E66B' : '#5C5C5C', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
    <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', left: isOn ? '22px' : '2px', transition: '0.3s' }} />
  </div>
);

const Tooltip = styled.div` position: absolute; ${props => props.$position === 'top' ? 'bottom: 100%;' : 'top: 100%;'} left: 0; transform: ${props => props.$position === 'top' ? 'translateY(-8px)' : 'translateY(8px)'}; background-color: #282828; color: #FFFFFF; padding: 8px 12px; border-radius: 8px; font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 500; white-space: nowrap; z-index: 100; opacity: 0; visibility: hidden; transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease; pointer-events: none; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5); &::after { content: ''; position: absolute; ${props => props.$position === 'top' ? 'top: 100%;' : 'bottom: 100%;'} left: 10px; border-width: 5px; border-style: solid; border-color: ${props => props.$position === 'top' ? '#282828 transparent transparent transparent' : 'transparent transparent #282828 transparent'}; } `;
const IconWrapper = styled.div` position: relative; display: flex; align-items: center; justify-content: center; cursor: help; &:hover ${Tooltip} { opacity: 1; visibility: visible; transform: ${props => props.$position === 'top' ? 'translateY(-4px)' : 'translateY(4px)'}; } `;

const PageWrapper = styled.div` display: flex; gap: 100px; padding: 40px; color: white; justify-content: center; font-family: 'Montserrat', sans-serif; width: 100%; `;
const LeftColumn = styled.div` display: flex; flex-direction: column; width: 535px; `;
const ActionHeader = styled.div` display: flex; justify-content: flex-end; gap: 16px; width: 100%; margin-bottom: 25px; margin-top: 20px; `;
const ActionText = styled.span` font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 16px; letter-spacing: -0.03em; color: ${props => props.$color}; cursor: pointer; &:hover { opacity: 0.8; } `;
const ContactRow = styled.div` display: flex; align-items: center; justify-content: space-between; width: 100%; height: 32px; `;
const ContactInfoWrapper = styled.div` display: flex; align-items: center; gap: 12px; `;
const LabelWrapper = styled.div` display: flex; align-items: center; gap: 8px; width: 110px; color: #A6A6A6; font-size: 16px; svg { width: 20px; height: 20px; flex-shrink: 0; } `;

const EditableInput = styled.input` width: 280px; height: 28px; background: transparent; border: none; border-bottom: 1px solid #5C5C5C; color: #FFFFFF; font-family: 'Montserrat', sans-serif; font-size: 16px; padding: 0 0 2px 0; outline: none; box-sizing: border-box; transition: border-bottom-color 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; &:focus { border-bottom-color: #95E66B; } `;
const StaticText = styled.div` width: 280px; height: 28px; font-size: 16px; display: flex; align-items: flex-end; padding: 0 0 2px 0; border-bottom: 1px solid transparent; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 26px; `;
const HideText = styled.span` font-family: 'Montserrat', sans-serif; font-weight: 500; font-size: 16px; letter-spacing: -0.03em; color: #959595; `;

const SkillsHeader = styled.div` display: flex; align-items: flex-end; justify-content: space-between; margin-top: 60px; margin-bottom: 16.5px; `;
const SkillCard = styled.div` width: 100%; min-height: 80px; background: #282828; border: 1px solid #5C5C5C; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 8px; box-sizing: border-box; margin-bottom: 8px; `;
const SkillLevel = styled.span` font-family: 'Montserrat', sans-serif; font-size: 16px; color: #959595; line-height: 100%; `;
const EmptySkillText = styled.span` font-family: 'Montserrat', sans-serif; font-size: 14px; color: #959595; `;
const TagsContainer = styled.div` display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; `;
const SkillTag = styled.div` background: #5C5C5C; color: #E3E3E3; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-family: 'Montserrat', sans-serif; display: flex; align-items: center; gap: 6px; ${props => props.$editable && `cursor: pointer;`} `;

// === ПРОЕКТЫ ===
const ProjectsContainer = styled.div` width: 758px; height: 909px; background: #282828; border-radius: 20px; padding: 30px; display: flex; flex-direction: column; box-sizing: border-box; `;
const ScrollWrapper = styled.div` flex: 1; width: 710px; overflow-y: auto; overflow-x: hidden; box-sizing: border-box; padding-right: 16px; margin-bottom: 24px; &::-webkit-scrollbar { width: 14px; } &::-webkit-scrollbar-thumb { background: #5C5C5C; border-radius: 8px; border: 4px solid #282828; } `;
const ProjectsGrid = styled.div` width: 678px; display: grid; grid-template-columns: 329px 329px; gap: 31px 20px; box-sizing: border-box; `;
const ProjectCard = styled.div` 
  width: 329px; height: 153px; border: 1px solid #5C5C5C; border-radius: 8px; 
  position: relative; box-sizing: border-box; background: transparent;
`;

// === НОВЫЕ СТИЛИ ТИПОГРАФИКИ КАРТОЧКИ ПРОЕКТА ИЗ ФИГМЫ ===
const ProjectTitle = styled.h4`
  position: absolute; top: 18px; left: 16px; margin: 0;
  width: 236px; height: 32px; /* Фиксированный размер */
  font-family: 'Montserrat', sans-serif;
  font-weight: 600; /* SemiBold */
  font-size: 26px; /* Размер из скрина */
  line-height: 100%;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const ProjectStatus = styled.span`
  position: absolute; top: 49px; left: 16px; margin: 0;
  height: 20px; /* Фиксированная высота */
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 14px; /* Оптимально для высоты 20px */
  line-height: 20px;
  color: ${props => props.$color}; 
`;

const ProjectInfoIcon = styled.div`
  position: absolute; top: 16px; right: 16px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  &:hover { opacity: 0.8; }
`;

const ProjectDesc = styled.p`
  position: absolute; top: 77px; left: 16px; margin: 0;
  width: 297px; height: 40px; /* Жесткий размер под 2 строки */
  font-family: 'Montserrat', sans-serif;
  font-size: 16px; /* Требование из ТЗ */
  line-height: 20px; /* 20 * 2 = 40px высоты */
  color: #FFFFFF; /* Белый цвет из ТЗ */
  overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
`;

const ProjectRole = styled.div`
  position: absolute; bottom: 13px; left: 16px; margin: 0;
  width: 236px; height: 20px; /* Фиксированный размер */
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 16px; /* Требование из ТЗ */
  line-height: 20px;
  color: #FFFFFF;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  span { color: #A4A4A4; }
`;

const ProjectButton = styled.button` width: 329px; height: 48px; border-radius: 8px; border: none; font-weight: 600; font-size: 16px; cursor: pointer; background: ${props => props.$primary ? '#95E66B' : 'transparent'}; color: ${props => props.$primary ? '#000' : '#fff'}; border: ${props => props.$primary ? 'none' : '1px solid #5C5C5C'}; `;

// === МОДАЛКА НАВЫКОВ ===
const EditSkillsModal = styled.div` width: 886px; min-height: 530px; height: auto; background: #282828; border: 1px solid #5C5C5C; border-radius: 20px; margin-top: 211px; padding: 47px 0 40px 0; display: flex; flex-direction: column; position: relative; box-sizing: border-box; `;
const EditSkillsTitle = styled.h1` margin: 0 0 24px 65px; font-family: 'Montserrat', sans-serif; font-size: 32px; font-weight: 600; color: #FFFFFF; line-height: 100%; `;
const EditSkillCard = styled.div` width: 788px; min-height: 86px; height: auto; margin-left: 50px; margin-bottom: 8px; background: #282828; border: 1px solid #5C5C5C; border-radius: 8px; padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; box-sizing: border-box; transition: height 0.2s ease; `;
const ConfirmButton = styled.button` width: 329px; height: 48px; border-radius: 8px; font-family: 'Montserrat'; font-weight: 500; font-size: 24px; cursor: pointer; margin: 18px auto 0 auto; background: ${props => props.$active ? '#95E66B' : 'transparent'}; color: ${props => props.$active ? '#151515' : '#929292'}; border: 1px solid ${props => props.$active ? '#95E66B' : '#5C5C5C'}; transition: 0.3s; `;
const DashedInputContainer = styled.div` position: relative; width: max-content; margin-top: 4px; `;
const DashedInput = styled.div` display: flex; align-items: center; gap: 8px; padding: 4px 16px; border: 1px dashed #5C5C5C; border-radius: 20px; cursor: text; width: fit-content; input { background: transparent; border: none; color: white; outline: none; font-size: 12px; width: 100px; font-family: 'Montserrat'; } `;
const DropdownMenu = styled.div` position: absolute; top: 100%; left: 0; margin-top: 8px; background: #5C5C5C; border-radius: 8px; padding: 8px 0; width: 200px; max-height: 150px; overflow-y: auto; z-index: 100; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5); &::-webkit-scrollbar { width: 8px; } &::-webkit-scrollbar-track { background: #5C5C5C; border-radius: 0 8px 8px 0; } &::-webkit-scrollbar-thumb { background: #151515; border-radius: 4px; } &::-webkit-scrollbar-button { display: none; } `;
const DropdownItem = styled.div` padding: 8px 16px; font-size: 14px; cursor: pointer; color: white; &:hover { background: #333333; } `;

export const ProfilePage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({ name: '', surname: '', filialName: '', email: '', telegramUsername: '' });

  const [emailVisible, setEmailVisible] = useState(true);
  const [tgVisible, setTgVisible] = useState(true);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [draftEmail, setDraftEmail] = useState('');
  const [draftTelegram, setDraftTelegram] = useState('');

  const [skills, setSkills] = useState({ high: [], medium: [], basic: [] });
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [draftSkills, setDraftSkills] = useState({ high: [], medium: [], basic: [] });
  const [activeSearchLevel, setActiveSearchLevel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableSkillsFromApi, setAvailableSkillsFromApi] = useState([]);

  const hasSkillChanges = JSON.stringify(skills) !== JSON.stringify(draftSkills);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/account/me`, {
          method: 'GET', credentials: 'include', headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          
          if (data.skills && Array.isArray(data.skills)) {
            const parsedSkills = { high: [], medium: [], basic: [] };
            data.skills.forEach(skillObj => {
              const skillId = skillObj.id || skillObj.skillId;
              const skillName = skillObj.name || skillObj.skillName || skillObj.title;
              const skillLevel = skillObj.level?.toLowerCase() || 'basic'; 
              const item = { id: skillId, name: skillName };
              if (skillLevel === 'high' || skillLevel === 2 || skillLevel === '2') parsedSkills.high.push(item);
              else if (skillLevel === 'medium' || skillLevel === 1 || skillLevel === '1') parsedSkills.medium.push(item);
              else parsedSkills.basic.push(item); 
            });
            setSkills(parsedSkills);
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error("Ошибка загрузки профиля", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (!activeSearchLevel) return;
    const fetchSkillsList = async () => {
      try {
        const url = new URL(`${API_URL}/api/skills`);
        if (searchQuery) url.searchParams.append('Search', searchQuery);
        url.searchParams.append('PageSize', '20');
        url.searchParams.append('Page', '1');
        const response = await fetch(url, { method: 'GET', credentials: 'include', headers: { 'Accept': 'application/json' } });
        if (response.ok) {
          const data = await response.json();
          setAvailableSkillsFromApi(data); 
        }
      } catch (error) { console.error(error); }
    };
    const timeoutId = setTimeout(() => fetchSkillsList(), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeSearchLevel]);

  const handleEditContact = () => { setDraftEmail(userData.email); setDraftTelegram(userData.telegramUsername); setIsEditingContact(true); };
  const handleCancelContact = () => setIsEditingContact(false);
  const handleSaveContact = () => { setUserData(prev => ({...prev, email: draftEmail, telegramUsername: draftTelegram})); setIsEditingContact(false); };

  const openSkillsEdit = () => { setDraftSkills(JSON.parse(JSON.stringify(skills))); setIsEditingSkills(true); };
  const closeSkillsEdit = () => { setIsEditingSkills(false); setActiveSearchLevel(null); setSearchQuery(''); };

  const removeSkill = (level, skillId) => { setDraftSkills(prev => ({ ...prev, [level]: prev[level].filter(s => s.id !== skillId) })); };
  const addSkill = (level, skillObj) => { setDraftSkills(prev => ({ ...prev, [level]: [...prev[level], skillObj] })); setActiveSearchLevel(null); setSearchQuery(''); };

  const saveSkills = async () => { 
    if (!hasSkillChanges) return;
    const levelMap = { 'basic': 0, 'medium': 1, 'high': 2 };
    const payload = [];
    ['high', 'medium', 'basic'].forEach(level => { draftSkills[level].forEach(skill => { payload.push({ id: skill.id, level: levelMap[level] }); }); });
    try {
      const response = await fetch(`${API_URL}/api/account/skills`, {
        method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) { setSkills(draftSkills); closeSkillsEdit(); } 
      else { console.error("Ошибка сохранения", await response.text()); }
    } catch (error) { console.error(error); }
  };

  const getFilteredSkills = () => {
    const allAddedIds = [...draftSkills.high.map(s => s.id), ...draftSkills.medium.map(s => s.id), ...draftSkills.basic.map(s => s.id)];
    return availableSkillsFromApi.filter(s => !allAddedIds.includes(s.id) && (s.name || s.title || '').toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const mockProjects = Array(10).fill(0).map((_, i) => {
    const statuses = [
      { text: 'в разработке', color: '#629D44' },
      { text: 'завершен', color: '#FB5656' },
      { text: 'заморожен', color: '#55A7EA' }
    ];
    return {
      id: i,
      title: 'Лютое название',
      desc: 'Мега-проект с чем-то там про что-то там',
      role: 'программист',
      status: statuses[i % 3] 
    };
  });

  if (isLoading) return <PageWrapper><h2>Загрузка профиля...</h2></PageWrapper>;

  if (isEditingSkills) {
    return (
      <PageWrapper style={{ alignItems: 'flex-start' }}>
        <EditSkillsModal>
          <div style={{ position: 'absolute', top: '24px', right: '24px', cursor: 'pointer' }} onClick={closeSkillsEdit}><CrossIcon /></div>
          <EditSkillsTitle>Какими навыками владеете?</EditSkillsTitle>
          {['high', 'medium', 'basic'].map((level) => {
            const names = { high: 'Высокий уровень', medium: 'Средний уровень', basic: 'Базовый уровень' };
            const isActive = activeSearchLevel === level;
            return (
              <EditSkillCard key={level}>
                <SkillLevel>{names[level]}</SkillLevel>
                {draftSkills[level].length > 0 && (
                  <TagsContainer>{draftSkills[level].map(skill => <SkillTag key={skill.id} $editable onClick={() => removeSkill(level, skill.id)}>{skill.name || skill.title} <SmallCrossIcon /></SkillTag>)}</TagsContainer>
                )}
                <DashedInputContainer>
                  <DashedInput onClick={() => setActiveSearchLevel(level)}>
                    <SearchIcon /><input placeholder="Укажите навык" value={isActive ? searchQuery : ''} onChange={(e) => setSearchQuery(e.target.value)} onBlur={() => setTimeout(() => setActiveSearchLevel(null), 200)} />
                  </DashedInput>
                  {isActive && (
                    <DropdownMenu>
                      {getFilteredSkills().length > 0 ? getFilteredSkills().map(s => <DropdownItem key={s.id} onMouseDown={() => addSkill(level, s)}>{s.name || s.title}</DropdownItem>) : <div style={{ padding: '8px 16px', fontSize: '12px', color: '#A6A6A6' }}>Ничего не найдено</div>}
                    </DropdownMenu>
                  )}
                </DashedInputContainer>
              </EditSkillCard>
            );
          })}
          <ConfirmButton $active={hasSkillChanges} disabled={!hasSkillChanges} onClick={saveSkills}>Подтвердить</ConfirmButton>
        </EditSkillsModal>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <LeftColumn>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '122px', height: '122px', borderRadius: '50%', background: '#D9D9D9', flexShrink: 0 }} />
          <div>
            <h2 style={{ fontSize: '32px', margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>{`${userData.name} ${userData.surname}`}</h2>
            <div style={{ width: '104px', height: '33px', background: '#6D4583', borderRadius: '23px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{userData.filialName || 'УрФУ'}</div>
          </div>
        </div>
        
        <ActionHeader>
          {isEditingContact ? (
            <><ActionText $color="#959595" onClick={handleCancelContact}>Отмена</ActionText><ActionText $color="#95E66B" onClick={handleSaveContact}>Сохранить</ActionText></>
          ) : (<ActionText $color="#95E66B" onClick={handleEditContact}>Редактировать</ActionText>)}
        </ActionHeader>

        <ContactRow>
          <ContactInfoWrapper>
            <LabelWrapper><IconWrapper $position="top">{emailVisible ? <OpenEye /> : <CloseEye />}<Tooltip $position="top">{emailVisible ? 'Ваша почта видна всем' : 'Почта скрыта'}</Tooltip></IconWrapper><span>Эл. почта:</span></LabelWrapper>
            {isEditingContact ? <EditableInput value={draftEmail} onChange={(e) => setDraftEmail(e.target.value)} /> : <StaticText>{userData.email}</StaticText>}
          </ContactInfoWrapper>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><HideText>Скрыть</HideText><Toggle isOn={!emailVisible} handleToggle={() => setEmailVisible(!emailVisible)} /></div>
        </ContactRow>

        <ContactRow style={{ marginTop: '9px' }}>
          <ContactInfoWrapper>
            <LabelWrapper><IconWrapper $position="bottom">{tgVisible ? <OpenEye /> : <CloseEye />}<Tooltip $position="bottom">{tgVisible ? 'Ваш Telegram виден всем' : 'Telegram скрыт'}</Tooltip></IconWrapper><span>Telegram:</span></LabelWrapper>
            {isEditingContact ? <EditableInput value={draftTelegram} onChange={(e) => setDraftTelegram(e.target.value)} /> : <StaticText>{userData.telegramUsername}</StaticText>}
          </ContactInfoWrapper>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><HideText>Скрыть</HideText><Toggle isOn={!tgVisible} handleToggle={() => setTgVisible(!tgVisible)} /></div>
        </ContactRow>

        <SkillsHeader>
          <h2 style={{ fontSize: '24px', margin: 0, lineHeight: '100%' }}>Навыки</h2>
          <ActionText $color="#95E66B" onClick={openSkillsEdit} style={{ marginBottom: '9px' }}>Редактировать</ActionText>
        </SkillsHeader>

        {['high', 'medium', 'basic'].map((level) => {
          const names = { high: 'Высокий уровень', medium: 'Средний уровень', basic: 'Базовый уровень' };
          return (
            <SkillCard key={level}>
              <SkillLevel>{names[level]}</SkillLevel>
              {skills[level].length > 0 ? <TagsContainer>{skills[level].map(skill => <SkillTag key={skill.id}>{skill.name || skill.title}</SkillTag>)}</TagsContainer> : <EmptySkillText>Вы не указали свои навыки</EmptySkillText>}
            </SkillCard>
          );
        })}
      </LeftColumn>
      
      <ProjectsContainer>
        <h2 style={{ fontSize: '32px', margin: '0 0 24px 0' }}>Проекты</h2>
        <ScrollWrapper>
          <ProjectsGrid>
            {mockProjects.map((project) => (
              <ProjectCard key={project.id}>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectInfoIcon onClick={() => navigate('/404')}><InfoIcon /></ProjectInfoIcon>
                <ProjectStatus $color={project.status.color}>{project.status.text}</ProjectStatus>
                <ProjectDesc>{project.desc}</ProjectDesc>
                <ProjectRole><span>Роль: </span>{project.role}</ProjectRole>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        </ScrollWrapper>
        <div style={{ display: 'flex', gap: '32px', marginTop: 'auto' }}>
          <ProjectButton $primary onClick={() => navigate('/404')}>Создать проект</ProjectButton>
          <ProjectButton onClick={() => navigate('/404')}>Найти проект</ProjectButton>
        </div>
      </ProjectsContainer>
    </PageWrapper>
  );
};