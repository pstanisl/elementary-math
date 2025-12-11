import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Avatar } from '@/components/Avatar/Avatar';
import { User } from '@/types';
import styles from './ProfileSelect.module.css';

export function ProfileSelect() {
  const navigate = useNavigate();
  const { users, loading, setCurrentUser } = useUser();

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'child') {
      navigate('/child');
    } else {
      navigate('/parent');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Načítání...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Vítej!</h1>
        <p className={styles.subtitle}>Zatím nemáme žádné uživatele. Kontaktuj administrátora.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Kdo jsi?
      </motion.h1>
      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Vyber svůj profil
      </motion.p>

      <div className={styles.profiles}>
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            className={styles.profileCard}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            onClick={() => handleSelectUser(user)}
          >
            <Avatar name={user.name} color={user.avatar_color} size="large" />
            <span className={styles.profileName}>{user.name}</span>
            <span className={styles.profileRole}>
              {user.role === 'parent' ? 'Rodič' : 'Dítě'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
