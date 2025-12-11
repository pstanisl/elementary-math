import { GeneratedProblem } from '@/types';
import styles from './Problem.module.css';

interface ColumnProblemProps {
  problem: GeneratedProblem;
  userAnswer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function ColumnProblem({
  problem,
  userAnswer,
  onAnswerChange,
  onSubmit,
  disabled,
}: ColumnProblemProps) {
  const { operand1, operand2, operator } = problem;

  const op1Str = operand1.toString();
  const op2Str = operand2.toString();
  const maxLen = Math.max(op1Str.length, op2Str.length);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      onSubmit();
    }
  };

  return (
    <div className={styles.columnContainer}>
      <div className={styles.columnProblem}>
        <div className={styles.columnRow}>
          <span className={styles.operatorSpace}></span>
          <span className={styles.number}>{op1Str.padStart(maxLen, ' ')}</span>
        </div>
        <div className={styles.columnRow}>
          <span className={styles.operator}>{operator}</span>
          <span className={styles.number}>{op2Str.padStart(maxLen, ' ')}</span>
        </div>
        <div className={styles.columnLine} style={{ width: `${(maxLen + 2) * 1.2}ch` }} />
        <div className={styles.columnRow}>
          <span className={styles.operatorSpace}></span>
          <input
            type="text"
            className={styles.columnInput}
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value.replace(/[^0-9-]/g, ''))}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoFocus
            placeholder={'?'.repeat(maxLen)}
            style={{ width: `${(maxLen + 1) * 1.2}ch` }}
          />
        </div>
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
