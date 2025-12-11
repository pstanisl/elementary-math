import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Header } from './Header';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const isHomePage = location.pathname === '/' || location.pathname === '/child' || location.pathname === '/parent';
  const showBackButton = !isHomePage && !!currentUser;

  const handleBack = () => {
    if (currentUser?.role === 'child') {
      navigate('/child');
    } else if (currentUser?.role === 'parent') {
      navigate('/parent');
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.layout}>
      <Header showBackButton={showBackButton} onBack={handleBack} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
