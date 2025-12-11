import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Avatar } from '@/components/Avatar/Avatar';
import styles from './Layout.module.css';

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Header({ showBackButton, onBack }: HeaderProps) {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();

  const handleAvatarClick = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        {showBackButton && (
          <button className={styles.backButton} onClick={onBack} aria-label="Zpět">
            ←
          </button>
        )}
        <h1 className={styles.title}>Matematika pro 4. třídu</h1>
      </div>
      <div className={styles.headerRight}>
        {currentUser && (
          <div className={styles.userInfo}>
            <span className={styles.userName}>{currentUser.name}</span>
            <Avatar
              name={currentUser.name}
              color={currentUser.avatar_color}
              size="small"
              onClick={handleAvatarClick}
            />
          </div>
        )}
      </div>
    </header>
  );
}
