import { GeneratedProblem, Topic } from '@/types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate numbers that will require carrying when added
function generateAdditionWithCarry(digits: number): [number, number] {
  const max = Math.pow(10, digits) - 1;
  const min = Math.pow(10, digits - 1);
  let a = randomInt(min, max);
  let b = randomInt(min, max);

  // Ensure at least one column will carry (sum of digits > 9)
  const aUnits = a % 10;
  const bUnits = b % 10;
  if (aUnits + bUnits < 10) {
    b = b - bUnits + (10 - aUnits + randomInt(0, aUnits - 1));
  }

  return [a, b];
}

// Generate numbers that won't require carrying
function generateAdditionNoCarry(digits: number): [number, number] {
  let a = 0;
  let b = 0;

  for (let i = 0; i < digits; i++) {
    const aDigit = randomInt(i === digits - 1 ? 1 : 0, 4);
    const bDigit = randomInt(0, 9 - aDigit);
    a = a * 10 + aDigit;
    b = b * 10 + bDigit;
  }

  return [a, b];
}

export function generateAdditionProblem(difficulty: number): GeneratedProblem {
  let operand1: number;
  let operand2: number;

  switch (difficulty) {
    case 1: // 2-digit, no carrying
      [operand1, operand2] = generateAdditionNoCarry(2);
      break;
    case 2: // 3-digit, with carrying
      [operand1, operand2] = generateAdditionWithCarry(3);
      break;
    case 3: // 4-digit, multiple carries
    default:
      [operand1, operand2] = generateAdditionWithCarry(4);
      break;
  }

  return {
    operand1,
    operand2,
    operator: '+',
    correctAnswer: operand1 + operand2,
    notation: difficulty >= 2 ? 'column' : 'inline',
  };
}

// Generate subtraction that may require borrowing
function generateSubtractionWithBorrow(digits: number): [number, number] {
  const max = Math.pow(10, digits) - 1;
  const min = Math.pow(10, digits - 1);
  let a = randomInt(min + Math.pow(10, digits - 1), max);
  let b = randomInt(min, a - 1);

  // Ensure borrowing is needed
  if ((a % 10) >= (b % 10)) {
    b = b - (b % 10) + (a % 10) + randomInt(1, 9 - (a % 10));
    if (b > a) {
      [a, b] = [b, a];
    }
  }

  return [Math.max(a, b), Math.min(a, b)];
}

function generateSubtractionNoBorrow(digits: number): [number, number] {
  let a = 0;
  let b = 0;

  for (let i = 0; i < digits; i++) {
    const aDigit = randomInt(i === digits - 1 ? 1 : 0, 9);
    const bDigit = randomInt(0, aDigit);
    a = a * 10 + aDigit;
    b = b * 10 + bDigit;
  }

  // Ensure a > b
  if (a <= b) {
    [a, b] = [b, a];
    if (a === b) a += randomInt(1, 10);
  }

  return [a, b];
}

export function generateSubtractionProblem(difficulty: number): GeneratedProblem {
  let operand1: number;
  let operand2: number;

  switch (difficulty) {
    case 1: // 2-digit, no borrowing
      [operand1, operand2] = generateSubtractionNoBorrow(2);
      break;
    case 2: // 3-digit, with borrowing
      [operand1, operand2] = generateSubtractionWithBorrow(3);
      break;
    case 3: // 4-digit, multiple borrows
    default:
      [operand1, operand2] = generateSubtractionWithBorrow(4);
      break;
  }

  return {
    operand1,
    operand2,
    operator: '-',
    correctAnswer: operand1 - operand2,
    notation: difficulty >= 2 ? 'column' : 'inline',
  };
}

export function generateMultiplicationProblem(difficulty: number): GeneratedProblem {
  let operand1: number;
  const operand2 = randomInt(2, 9);

  switch (difficulty) {
    case 1: // 2-digit x 1-digit
      operand1 = randomInt(10, 99);
      break;
    case 2: // 3-digit x 1-digit
      operand1 = randomInt(100, 999);
      break;
    case 3: // 4-digit x 1-digit
    default:
      operand1 = randomInt(1000, 9999);
      break;
  }

  return {
    operand1,
    operand2,
    operator: '×',
    correctAnswer: operand1 * operand2,
    notation: difficulty >= 2 ? 'column' : 'inline',
  };
}

export function generateDivisionProblem(difficulty: number): GeneratedProblem {
  const divisor = randomInt(2, 9);
  let quotient: number;

  switch (difficulty) {
    case 1: // Result is 2-digit
      quotient = randomInt(10, 99);
      break;
    case 2: // Result is 3-digit
      quotient = randomInt(100, 999);
      break;
    case 3: // Result is 3-4 digit
    default:
      quotient = randomInt(100, 1500);
      break;
  }

  const dividend = quotient * divisor;

  return {
    operand1: dividend,
    operand2: divisor,
    operator: ':',
    correctAnswer: quotient,
    notation: 'inline',
  };
}

export function generateRoundingProblem(difficulty: number): GeneratedProblem {
  let number: number;
  let roundingTarget: number;

  switch (difficulty) {
    case 1: // Round to tens
      number = randomInt(100, 999);
      roundingTarget = 10;
      break;
    case 2: // Round to hundreds
      number = randomInt(1000, 9999);
      roundingTarget = 100;
      break;
    case 3: // Round to thousands
    default:
      number = randomInt(1000, 99999);
      roundingTarget = 1000;
      break;
  }

  const correctAnswer = Math.round(number / roundingTarget) * roundingTarget;

  return {
    operand1: number,
    operand2: roundingTarget,
    operator: '≈',
    correctAnswer,
    notation: 'inline',
    roundingTarget,
  };
}

export function generateProblem(topic: Topic, difficulty: number): GeneratedProblem {
  switch (topic) {
    case 'addition':
      return generateAdditionProblem(difficulty);
    case 'subtraction':
      return generateSubtractionProblem(difficulty);
    case 'multiplication':
      return generateMultiplicationProblem(difficulty);
    case 'division':
      return generateDivisionProblem(difficulty);
    case 'rounding':
      return generateRoundingProblem(difficulty);
    default:
      return generateAdditionProblem(difficulty);
  }
}
