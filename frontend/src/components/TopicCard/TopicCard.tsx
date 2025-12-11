import { Topic, topicNames, topicIcons } from '@/types';
import styles from './TopicCard.module.css';

interface TopicCardProps {
  topic: Topic;
  progress: { correct: number; total: number };
  onLearnClick: () => void;
  onPracticeClick: () => void;
}

export function TopicCard({ topic, progress, onLearnClick, onPracticeClick }: TopicCardProps) {
  const masteryGoal = 20;
  const progressPercent = Math.min((progress.correct / masteryGoal) * 100, 100);

  return (
    <div className={styles.card}>
      <div className={styles.icon}>{topicIcons[topic]}</div>
      <h3 className={styles.title}>{topicNames[topic]}</h3>

      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
        <span className={styles.progressText}>
          {progress.correct}/{masteryGoal}
        </span>
      </div>

      <div className={styles.buttons}>
        <button className={styles.learnButton} onClick={onLearnClick}>
          Učení
        </button>
        <button className={styles.practiceButton} onClick={onPracticeClick}>
          Procvičování
        </button>
      </div>
    </div>
  );
}
