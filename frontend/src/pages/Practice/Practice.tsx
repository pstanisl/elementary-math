import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { InlineProblem } from '@/components/Problem/InlineProblem';
import { ColumnProblem } from '@/components/Problem/ColumnProblem';
import { Feedback, Solution } from '@/components/Feedback/Feedback';
import { generateProblem } from '@/utils/problemGenerator';
import { detectErrorType } from '@/utils/errorDetection';
import { saveExercise } from '@/api/exercises';
import { Topic, GeneratedProblem, ErrorType, topicNames, BadgeType, badgeInfo } from '@/types';
import styles from './Practice.module.css';

type FeedbackState = 'none' | 'correct' | 'incorrect' | 'solution';

export function Practice() {
  const { topic } = useParams<{ topic: Topic }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const [problem, setProblem] = useState<GeneratedProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('none');
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [problemCount, setProblemCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [newBadge, setNewBadge] = useState<BadgeType | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const validTopic = topic as Topic;

  const generateNewProblem = useCallback(() => {
    const newProblem = generateProblem(validTopic, difficulty);
    setProblem(newProblem);
    setUserAnswer('');
    setFeedbackState('none');
    setErrorType(null);
    setWrongAttempts(0);
    setStartTime(Date.now());
  }, [validTopic, difficulty]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    if (!topic || !['addition', 'subtraction', 'multiplication', 'division', 'rounding'].includes(topic)) {
      navigate('/child');
      return;
    }
    generateNewProblem();
  }, [currentUser, topic, navigate, generateNewProblem]);

  const handleSubmit = async () => {
    if (!problem || !currentUser) return;

    const answer = parseInt(userAnswer, 10);
    if (isNaN(answer)) return;

    const isCorrect = answer === problem.correctAnswer;
    const detectedError = isCorrect ? null : detectErrorType(problem, answer);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    setErrorType(detectedError);

    // Save to backend
    try {
      const result = await saveExercise({
        user_id: currentUser.id,
        topic: validTopic,
        difficulty,
        problem: {
          operand1: problem.operand1,
          operand2: problem.operand2,
          operator: problem.operator,
          notation: problem.notation,
          roundingTarget: problem.roundingTarget,
        },
        user_answer: userAnswer,
        correct_answer: problem.correctAnswer.toString(),
        is_correct: isCorrect,
        error_type: detectedError || undefined,
        time_spent_seconds: timeSpent,
      });

      // Check for new badges
      if (result.new_badges && result.new_badges.length > 0) {
        setNewBadge(result.new_badges[0]);
      }
    } catch (error) {
      console.error('Failed to save exercise:', error);
    }

    if (isCorrect) {
      setFeedbackState('correct');
      setCorrectCount((c) => c + 1);
      setProblemCount((c) => c + 1);
      setConsecutiveCorrect((c) => c + 1);

      // Increase difficulty after 5 consecutive correct
      if (consecutiveCorrect + 1 >= 5 && difficulty < 3) {
        setDifficulty((d) => d + 1);
        setConsecutiveCorrect(0);
      }
    } else {
      setFeedbackState('incorrect');
      setWrongAttempts((w) => w + 1);
      setConsecutiveCorrect(0);

      // Decrease difficulty after 3 wrong attempts on same problem
      if (wrongAttempts + 1 >= 3 && difficulty > 1) {
        setDifficulty((d) => d - 1);
      }
    }
  };

  const handleTryAgain = () => {
    setUserAnswer('');
    setFeedbackState('none');
  };

  const handleShowSolution = () => {
    setFeedbackState('solution');
    setProblemCount((c) => c + 1);
  };

  const handleContinue = () => {
    setNewBadge(null);
    generateNewProblem();
  };

  const handleDismissBadge = () => {
    setNewBadge(null);
  };

  if (!problem) {
    return <div className={styles.loading}>Načítání...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{topicNames[validTopic]}</h1>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            Příklad: {problemCount + 1}
          </span>
          <span className={styles.statItem}>
            Správně: {correctCount}
          </span>
          <span className={styles.statItem}>
            Úroveň: {difficulty}
          </span>
        </div>
      </div>

      <div className={styles.problemArea}>
        <AnimatePresence mode="wait">
          {feedbackState === 'none' && (
            <motion.div
              key="problem"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {problem.notation === 'column' ? (
                <ColumnProblem
                  problem={problem}
                  userAnswer={userAnswer}
                  onAnswerChange={setUserAnswer}
                  onSubmit={handleSubmit}
                />
              ) : (
                <InlineProblem
                  problem={problem}
                  userAnswer={userAnswer}
                  onAnswerChange={setUserAnswer}
                  onSubmit={handleSubmit}
                />
              )}
            </motion.div>
          )}

          {(feedbackState === 'correct' || feedbackState === 'incorrect') && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Feedback
                isCorrect={feedbackState === 'correct'}
                correctAnswer={problem.correctAnswer}
                errorType={errorType}
                wrongAttempts={wrongAttempts}
                onContinue={handleContinue}
                onTryAgain={handleTryAgain}
                onShowSolution={handleShowSolution}
              />
            </motion.div>
          )}

          {feedbackState === 'solution' && (
            <motion.div
              key="solution"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Solution problem={problem} onContinue={handleContinue} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Badge celebration modal */}
      <AnimatePresence>
        {newBadge && (
          <motion.div
            className={styles.badgeOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismissBadge}
          >
            <motion.div
              className={styles.badgeModal}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.badgeIcon}>{badgeInfo[newBadge].icon}</div>
              <h2>Nový odznak!</h2>
              <h3>{badgeInfo[newBadge].name}</h3>
              <p>{badgeInfo[newBadge].description}</p>
              <button className={styles.badgeButton} onClick={handleDismissBadge}>
                Super!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
