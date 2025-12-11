import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { getUserStats } from '@/api/stats';
import { getUserBadges } from '@/api/badges';
import { UserStats, Badge, Topic, topicNames, badgeInfo, errorMessages, ErrorType } from '@/types';
import styles from './ParentDashboard.module.css';

export function ParentDashboard() {
  const navigate = useNavigate();
  const { currentUser, users } = useUser();
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const childUsers = users.filter((u) => u.role === 'child');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'parent') {
      navigate('/');
      return;
    }

    if (childUsers.length > 0 && !selectedChildId) {
      setSelectedChildId(childUsers[0].id);
    }
  }, [currentUser, navigate, childUsers, selectedChildId]);

  useEffect(() => {
    if (!selectedChildId) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [statsData, badgesData] = await Promise.all([
          getUserStats(selectedChildId!),
          getUserBadges(selectedChildId!),
        ]);
        setStats(statsData);
        setBadges(badgesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedChildId]);

  if (!currentUser) return null;

  const selectedChild = childUsers.find((u) => u.id === selectedChildId);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Přehled výsledků</h1>

      {childUsers.length > 1 && (
        <div className={styles.childSelector}>
          <label>Vybrat dítě:</label>
          <select
            value={selectedChildId || ''}
            onChange={(e) => setSelectedChildId(Number(e.target.value))}
          >
            {childUsers.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Načítání...</div>
      ) : stats ? (
        <div className={styles.dashboard}>
          {/* Activity Overview */}
          <section className={styles.section}>
            <h2>Aktivita - {selectedChild?.name}</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{stats.total_exercises}</span>
                <span className={styles.statLabel}>Celkem příkladů</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{stats.correct_exercises}</span>
                <span className={styles.statLabel}>Správně</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{stats.overall_accuracy.toFixed(0)}%</span>
                <span className={styles.statLabel}>Úspěšnost</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{stats.days_practiced_this_week}/7</span>
                <span className={styles.statLabel}>Dní tento týden</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>
                  {stats.current_streak} 🔥
                </span>
                <span className={styles.statLabel}>Série dní</span>
              </div>
            </div>
          </section>

          {/* Topic Results */}
          <section className={styles.section}>
            <h2>Výsledky podle témat</h2>
            <div className={styles.topicsList}>
              {stats.topic_stats.map((ts) => (
                <div key={ts.topic} className={styles.topicRow}>
                  <span className={styles.topicName}>{topicNames[ts.topic as Topic]}</span>
                  <div className={styles.topicProgress}>
                    <div className={styles.progressBar}>
                      <div
                        className={`${styles.progressFill} ${
                          ts.accuracy_percentage < 60 ? styles.warning : ''
                        }`}
                        style={{ width: `${ts.accuracy_percentage}%` }}
                      />
                    </div>
                    <span className={styles.topicPercent}>
                      {ts.accuracy_percentage.toFixed(0)}%
                      {ts.accuracy_percentage < 60 && ' ⚠️'}
                    </span>
                  </div>
                  <span className={styles.topicCount}>
                    {ts.correct_count}/{ts.total_attempts}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Common Errors */}
          <section className={styles.section}>
            <h2>Časté chyby</h2>
            <div className={styles.errorsList}>
              {stats.topic_stats.flatMap((ts) =>
                ts.common_errors.map((err) => (
                  <div key={`${ts.topic}-${err}`} className={styles.errorItem}>
                    <span className={styles.errorTopic}>{topicNames[ts.topic as Topic]}:</span>
                    <span className={styles.errorText}>{errorMessages[err as ErrorType]}</span>
                  </div>
                ))
              )}
              {stats.topic_stats.every((ts) => ts.common_errors.length === 0) && (
                <p className={styles.noErrors}>Zatím žádné výrazné chyby! 🎉</p>
              )}
            </div>
          </section>

          {/* Badges */}
          <section className={styles.section}>
            <h2>Získané odznaky ({badges.length}/9)</h2>
            <div className={styles.badgesGrid}>
              {badges.map((badge) => (
                <div key={badge.id} className={styles.badgeItem}>
                  <span className={styles.badgeIcon}>{badgeInfo[badge.badge_type].icon}</span>
                  <span className={styles.badgeName}>{badgeInfo[badge.badge_type].name}</span>
                </div>
              ))}
              {badges.length === 0 && (
                <p className={styles.noBadges}>Zatím žádné odznaky</p>
              )}
            </div>
          </section>

          {/* Recent Activity */}
          <section className={styles.section}>
            <h2>Poslední aktivita</h2>
            <div className={styles.activityList}>
              {stats.recent_activity.slice(0, 10).map((ex) => (
                <div key={ex.id} className={styles.activityItem}>
                  <span className={styles.activityDate}>
                    {new Date(ex.created_at).toLocaleDateString('cs-CZ')}
                  </span>
                  <span className={styles.activityTopic}>{topicNames[ex.topic]}</span>
                  <span
                    className={`${styles.activityResult} ${
                      ex.is_correct ? styles.correct : styles.incorrect
                    }`}
                  >
                    {ex.is_correct ? '✓' : '✗'}
                  </span>
                </div>
              ))}
              {stats.recent_activity.length === 0 && (
                <p className={styles.noActivity}>Zatím žádná aktivita</p>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className={styles.noData}>Nepodařilo se načíst data</div>
      )}
    </div>
  );
}
