import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { TopicCard } from '@/components/TopicCard/TopicCard';
import { Topic, TopicStats } from '@/types';
import { getUserStats } from '@/api/stats';
import styles from './ChildHome.module.css';

const topics: Topic[] = ['addition', 'subtraction', 'multiplication', 'division', 'rounding'];

export function ChildHome() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [topicStats, setTopicStats] = useState<Map<Topic, TopicStats>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    async function fetchStats() {
      try {
        const stats = await getUserStats(currentUser!.id);
        const statsMap = new Map<Topic, TopicStats>();
        stats.topic_stats.forEach((ts) => {
          statsMap.set(ts.topic, ts);
        });
        setTopicStats(statsMap);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const getProgress = (topic: Topic) => {
    const stats = topicStats.get(topic);
    return {
      correct: stats?.correct_count || 0,
      total: stats?.total_attempts || 0,
    };
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.welcome}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Ahoj, {currentUser.name}!</h1>
        <p>Co chceš dnes procvičovat?</p>
      </motion.div>

      {loading ? (
        <div className={styles.loading}>Načítání...</div>
      ) : (
        <div className={styles.topicsGrid}>
          {topics.map((topic, index) => (
            <motion.div
              key={topic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TopicCard
                topic={topic}
                progress={getProgress(topic)}
                onLearnClick={() => navigate(`/learn/${topic}`)}
                onPracticeClick={() => navigate(`/practice/${topic}`)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
