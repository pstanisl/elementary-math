import { GeneratedProblem } from '@/types';
import styles from './Problem.module.css';

interface InlineProblemProps {
  problem: GeneratedProblem;
  userAnswer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function InlineProblem({
  problem,
  userAnswer,
  onAnswerChange,
  onSubmit,
  disabled,
}: InlineProblemProps) {
  const { operand1, operand2, operator, roundingTarget } = problem;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      onSubmit();
    }
  };

  // Format the problem display
  const renderProblem = () => {
    if (operator === '≈') {
      const targetName =
        roundingTarget === 10 ? 'desítky' : roundingTarget === 100 ? 'stovky' : 'tisíce';
      return (
        <span className={styles.equation}>
          Zaokrouhli <strong>{operand1.toLocaleString('cs-CZ')}</strong> na {targetName}
        </span>
      );
    }

    return (
      <span className={styles.equation}>
        {operand1.toLocaleString('cs-CZ')} {operator} {operand2.toLocaleString('cs-CZ')} =
      </span>
    );
  };

  return (
    <div className={styles.inlineContainer}>
      <div className={styles.problemRow}>
        {renderProblem()}
        <input
          type="text"
          className={styles.inlineInput}
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value.replace(/[^0-9-]/g, ''))}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoFocus
          placeholder="?"
        />
      </div>
      <button
        className={styles.submitButton}
        onClick={onSubmit}
        disabled={disabled || !userAnswer.trim()}
      >
        Zkontrolovat
      </button>
    </div>
  );
}
