import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from '../widgets/icons/arrow-left.svg';

const API_URL = 'http://localhost:5000'; // ПОРТ ТВОЕГО БЭКЕНДА

// === ВСТРОЕННЫЕ ИКОНКИ ===
const SmallCrossIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// === СТИЛИ СТРАНИЦЫ И ОТСТУПЫ ===
const PageWrapper = styled.div`
  width: 100%;
  min-height: calc(100vh - 64px);
  background-color: #151515;
  box-sizing: border-box;
  padding-top: 89px; /* От шапки по Фигме */
  padding-left: 163px; /* От левого края по Фигме */
  padding-right: 163px; 
  font-family: 'Montserrat', sans-serif;
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 32px;
  line-height: 100%;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  margin: 0 0 24px 0;
`;

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 80px; /* Отступ до пустого стейта или карточек */
`;

const SearchInput = styled.input`
  width: 436px;
  height: 37px;
  background: transparent;
  border: 1px solid #5C5C5C;
  border-radius: 6px;
  padding-left: 19px; 
  padding-top: 8.63px;
  padding-bottom: 8.63px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &::placeholder { color: #5C5C5C; }
  &:focus { border-color: #95E66B; }
`;

const SkillsFilterWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 22px; /* Отступ от поиска */
  gap: 10px; /* Отступ между дропдауном и тегами */
  flex-wrap: wrap;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.div`
  height: 37px;
  background: #5C5C5C;
  border-radius: 6px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  user-select: none;

  svg {
    width: 16px;
    height: 16px;
    stroke: #FFFFFF;
    transform: ${props => props.$isOpen ? 'rotate(90deg)' : 'rotate(-90deg)'};
    transition: transform 0.2s;
  }
`;

const DropdownMenu = styled.div`
  position: absolute; top: calc(100% + 4px); left: 0; width: 200px; max-height: 150px; 
  background: #5C5C5C; border-radius: 8px; overflow-y: auto; z-index: 100; padding: 8px 0;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5);
  
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: #5C5C5C; border-radius: 0 8px 8px 0; }
  &::-webkit-scrollbar-thumb { background: #151515; border-radius: 4px; }
`;

const DropdownItem = styled.div`
  padding: 8px 16px; font-size: 14px; cursor: pointer; color: white;
  &:hover { background: #333333; }
`;

const SkillTag = styled.div`
  background: #5C5C5C; color: #E3E3E3; padding: 6px 12px; border-radius: 16px; font-size: 12px;
  font-family: 'Montserrat', sans-serif; display: flex; align-items: center; gap: 6px;
  cursor: pointer;
  &:hover { background: #FF4D4D; color: white; } 
`;

const EmptyStateText = styled.p`
  font-family: 'Montserrat', sans-serif; font-size: 20px; color: #959595; margin: 0; 
  padding-left: 1px; 
`;

// === СТИЛИ КАРТОЧЕК ПОЛЬЗОВАТЕЛЕЙ ===
const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  padding-bottom: 40px;
`;

const UserCard = styled.div`
  background: transparent;
  border: 1px solid #5C5C5C;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UserHeader = styled.div`
  display: flex; gap: 16px; align-items: flex-start;
`;

const Avatar = styled.div`
  width: 64px; height: 64px; border-radius: 50%; background: #D9D9D9; flex-shrink: 0;
`;

const UserInfo = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`;

const UserName = styled.h3`
  margin: 0; font-size: 20px; font-weight: 600; color: #FFFFFF; font-family: 'Montserrat', sans-serif;
`;

const UserSkillsContainer = styled.div`
  display: flex; gap: 6px; flex-wrap: wrap;
`;

const UserSkillBadge = styled.span`
  background: #5C5C5C; color: #FFFFFF; padding: 4px 10px; border-radius: 12px; 
  font-size: 12px; font-family: 'Montserrat', sans-serif;
`;

const CardActions = styled.div`
  display: flex; justify-content: flex-end; gap: 16px; margin-top: auto;
`;

const ActionButton = styled.button`
  height: 36px; padding: 0 20px; border-radius: 8px; font-weight: 600; font-size: 14px;
  font-family: 'Montserrat', sans-serif; cursor: pointer; transition: 0.2s;
  
  /* Если primary - зеленая, иначе прозрачная */
  background: ${props => props.$primary ? '#95E66B' : 'transparent'};
  color: ${props => props.$primary ? '#151515' : '#95E66B'};
  border: none;
  
  &:hover { opacity: 0.8; }
`;

export const UsersPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [availableSkillsFromApi, setAvailableSkillsFromApi] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

// 1. ЗАГРУЗКА СКИЛЛОВ
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${API_URL}/api/skills?PageSize=100&Page=1`, {
          method: 'GET',
          credentials: 'include',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' // Возвращаем жестко
          }
        });
        if (response.ok) {
          const data = await response.json();
          const dataArray = Array.isArray(data) ? data : (data.items || data.data || []);
          const skillNames = dataArray.map(s => s.name || s.title || s.skillName || s);
          setAvailableSkillsFromApi(skillNames);
        }
      } catch (error) { console.error(error); }
    };
    fetchSkills();
  }, []);

  // 2. ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ (Фикс 400 ошибки)
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const url = new URL(`${API_URL}/api/users`);
        
        // ВАЖНО: Добавляем пагинацию
        url.searchParams.append('PageSize', '50');
        url.searchParams.append('Page', '1');
        
        // ВАЖНО: Добавляем Search ТОЛЬКО если в строке есть текст
        if (searchQuery && searchQuery.trim() !== '') {
          url.searchParams.append('Search', searchQuery.trim());
        }
        
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          // Достаем массив пользователей
          const usersArray = Array.isArray(data) ? data : (data.items || data.data || []);
          setUsers(usersArray); 
        } else {
          // Выводим текст ошибки от бэкенда в консоль, чтобы точно знать, в чем дело!
          const errorText = await response.text();
          console.error(`Бэкенд вернул 400. Ошибка: ${errorText}`);
        }
      } catch (error) {
        console.error("CORS или сетевая ошибка при загрузке пользователей:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const filteredUsers = users.filter(user => {
    if (selectedSkills.length === 0) return true;
    const userSkills = user.skills || user.userSkills || [];
    const userSkillNames = userSkills.map(s => (s.name || s.skillName || s.title || s).toLowerCase());
    return selectedSkills.every(selectedSkill => userSkillNames.includes(selectedSkill.toLowerCase()));
  });

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const addSkill = (skill) => { if (!selectedSkills.includes(skill)) setSelectedSkills([...selectedSkills, skill]); setIsDropdownOpen(false); };
  const removeSkill = (skillToRemove) => setSelectedSkills(selectedSkills.filter(s => s !== skillToRemove));
  const filteredAvailableSkills = availableSkillsFromApi.filter(s => !selectedSkills.includes(s));
  return (
    <PageWrapper>
      <Title>Кого хотите найти?</Title>
      
      <FiltersRow>
        <SearchInput 
          placeholder="Поиск по имени..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <SkillsFilterWrapper>
          <DropdownContainer>
            <DropdownButton $isOpen={isDropdownOpen} onClick={toggleDropdown}>
              Выберите навык
              <ArrowLeft />
            </DropdownButton>
            
            {isDropdownOpen && (
              <DropdownMenu>
                {filteredAvailableSkills.length > 0 ? (
                  filteredAvailableSkills.map(skill => (
                    <DropdownItem key={skill} onMouseDown={() => addSkill(skill)}>
                      {skill}
                    </DropdownItem>
                  ))
                ) : (
                  <div style={{ padding: '8px 16px', color: '#A6A6A6', fontSize: '12px' }}>Нет доступных навыков</div>
                )}
              </DropdownMenu>
            )}
          </DropdownContainer>

          {selectedSkills.map(skill => (
            <SkillTag key={skill} onClick={() => removeSkill(skill)}>
              {skill} <SmallCrossIcon />
            </SkillTag>
          ))}
        </SkillsFilterWrapper>
      </FiltersRow>

      {/* ВЫВОД РЕЗУЛЬТАТОВ */}
      {isLoading ? (
        <EmptyStateText>Загрузка участников...</EmptyStateText>
      ) : filteredUsers.length > 0 ? (
        <UsersGrid>
          {filteredUsers.map((user) => (
            <UserCard key={user.id || Math.random()}>
              <UserHeader>
                <Avatar />
                <UserInfo>
                  <UserName>{user.name} {user.surname}</UserName>
                  <UserSkillsContainer>
                    {(user.skills || user.userSkills || []).map(s => (
                      <UserSkillBadge key={s.id || s}>
                        {s.name || s.title || s.skillName || s}
                      </UserSkillBadge>
                    ))}
                  </UserSkillsContainer>
                </UserInfo>
              </UserHeader>
              
              <CardActions>
                <ActionButton onClick={() => navigate('/404')}>Открыть профиль</ActionButton>
                <ActionButton $primary onClick={() => navigate('/404')}>Пригласить</ActionButton>
              </CardActions>
            </UserCard>
          ))}
        </UsersGrid>
      ) : (
        <EmptyStateText>Кажется, такого человека нет</EmptyStateText>
      )}

    </PageWrapper>
  );
};