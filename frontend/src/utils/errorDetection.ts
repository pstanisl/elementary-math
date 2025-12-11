import { ErrorType, GeneratedProblem } from '@/types';

export function detectErrorType(
  problem: GeneratedProblem,
  userAnswer: number
): ErrorType | null {
  const { operand1, operand2, operator, correctAnswer } = problem;
  const diff = Math.abs(userAnswer - correctAnswer);

  if (userAnswer === correctAnswer) {
    return null;
  }

  switch (operator) {
    case '+': {
      // Check for carry error (off by 10, 100, 1000, etc.)
      if (diff === 10 || diff === 100 || diff === 1000 || diff === 10000) {
        return 'carry_error';
      }
      // Check if digits were swapped or misplaced
      const userStr = String(userAnswer);
      const correctStr = String(correctAnswer);
      if (userStr.length === correctStr.length) {
        let digitDiffs = 0;
        for (let i = 0; i < userStr.length; i++) {
          if (userStr[i] !== correctStr[i]) digitDiffs++;
        }
        if (digitDiffs === 1) {
          return 'calculation_error';
        }
        if (digitDiffs === 2 && userStr.split('').sort().join('') === correctStr.split('').sort().join('')) {
          return 'place_value_error';
        }
      }
      return 'calculation_error';
    }

    case '-': {
      // Check for borrow error
      if (diff === 10 || diff === 100 || diff === 1000 || diff === 10000) {
        return 'borrow_error';
      }
      // Check if user might have done |a-b| instead of proper borrowing
      let possibleReverse = 0;
      const o1Str = String(operand1);
      const o2Str = String(operand2).padStart(o1Str.length, '0');

      for (let i = 0; i < o1Str.length; i++) {
        possibleReverse = possibleReverse * 10 + Math.abs(parseInt(o1Str[i]) - parseInt(o2Str[i]));
      }

      if (userAnswer === possibleReverse) {
        return 'borrow_error';
      }

      return 'calculation_error';
    }

    case '×': {
      // Check for carry error in multiplication
      if (diff % 10 === 0 && diff <= operand2 * 10) {
        return 'carry_error';
      }
      return 'calculation_error';
    }

    case ':': {
      // Division errors are usually calculation errors
      return 'calculation_error';
    }

    case '≈': {
      // Rounding direction error
      const roundingTarget = problem.roundingTarget || 10;
      const roundDown = Math.floor(operand1 / roundingTarget) * roundingTarget;
      const roundUp = Math.ceil(operand1 / roundingTarget) * roundingTarget;

      if (userAnswer === roundDown && correctAnswer === roundUp) {
        return 'rounding_direction_error';
      }
      if (userAnswer === roundUp && correctAnswer === roundDown) {
        return 'rounding_direction_error';
      }
      return 'calculation_error';
    }

    default:
      return 'calculation_error';
  }
}
