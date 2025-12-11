import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export function Avatar({ name, color, size = 'medium', onClick }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`${styles.avatar} ${styles[size]} ${onClick ? styles.clickable : ''}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {initial}
    </div>
  );
}
