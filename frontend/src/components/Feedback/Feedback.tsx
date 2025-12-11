import { motion } from 'framer-motion';
import { ErrorType, errorMessages } from '@/types';
import styles from './Feedback.module.css';

interface FeedbackProps {
  isCorrect: boolean;
  correctAnswer: number;
  errorType?: ErrorType | null;
  wrongAttempts: number;
  onContinue: () => void;
  onTryAgain: () => void;
  onShowSolution: () => void;
}

const encouragingMessages = [
  'Výborně!',
  'Správně!',
  'Skvělé!',
  'Tak držet!',
  'Paráda!',
  'Super!',
];

export function Feedback({
  isCorrect,
  correctAnswer: _correctAnswer,
  errorType,
  wrongAttempts,
  onContinue,
  onTryAgain,
  onShowSolution,
}: FeedbackProps) {
  void _correctAnswer; // Reserved for future use in showing answer
  const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  if (isCorrect) {
    return (
      <motion.div
        className={`${styles.feedback} ${styles.correct}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className={styles.icon}>✓</div>
        <h2 className={styles.message}>{randomMessage}</h2>
        <button className={styles.continueButton} onClick={onContinue}>
          Další příklad
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`${styles.feedback} ${styles.incorrect}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className={styles.icon}>✗</div>
      <h2 className={styles.message}>Zkus to znovu</h2>

      {errorType && <p className={styles.hint}>{errorMessages[errorType]}</p>}

      <div className={styles.buttons}>
        <button className={styles.tryAgainButton} onClick={onTryAgain}>
          Zkusit znovu
        </button>
        {wrongAttempts >= 2 && (
          <button className={styles.showSolutionButton} onClick={onShowSolution}>
            Ukaž řešení
          </button>
        )}
      </div>
    </motion.div>
  );
}

interface SolutionProps {
  problem: {
    operand1: number;
    operand2: number;
    operator: string;
    correctAnswer: number;
  };
  onContinue: () => void;
}

export function Solution({ problem, onContinue }: SolutionProps) {
  const { operand1, operand2, operator, correctAnswer } = problem;

  return (
    <motion.div
      className={styles.solution}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>Řešení:</h3>
      <div className={styles.solutionContent}>
        <p className={styles.solutionEquation}>
          {operand1.toLocaleString('cs-CZ')} {operator} {operand2.toLocaleString('cs-CZ')} ={' '}
          <strong>{correctAnswer.toLocaleString('cs-CZ')}</strong>
        </p>
      </div>
      <button className={styles.continueButton} onClick={onContinue}>
        Další příklad
      </button>
    </motion.div>
  );
}
