import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Topic, topicNames, GeneratedProblem } from '@/types';
import { generateProblem } from '@/utils/problemGenerator';
import styles from './Learn.module.css';

type Phase = 'intro' | 'demo' | 'interactive' | 'complete';

interface StepData {
  narration: string;
  highlightColumn?: number;
  showCarry?: boolean;
  carryValue?: number;
  result?: string;
}

export function Learn() {
  const { topic } = useParams<{ topic: Topic }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [problem, setProblem] = useState<GeneratedProblem | null>(null);
  const [userInput, setUserInput] = useState('');
  const [interactiveStep, setInteractiveStep] = useState(0);
  const [practiceCount, setPracticeCount] = useState(0);

  const validTopic = topic as Topic;

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    if (!topic || !['addition', 'subtraction', 'multiplication', 'division', 'rounding'].includes(topic)) {
      navigate('/child');
      return;
    }
  }, [currentUser, topic, navigate]);

  const getIntroContent = () => {
    switch (validTopic) {
      case 'addition':
        return {
          title: 'Sčítání',
          description: 'Naučíme se sčítat větší čísla pomocí písemného sčítání. Důležité je správně zarovnat čísla a pamatovat na přenos desítek.',
          tips: [
            'Začínáme vždy zprava - od jednotek',
            'Když je součet větší než 9, přenášíme desítku',
            'Přenesenou desítku přičteme k dalšímu sloupci',
          ],
        };
      case 'subtraction':
        return {
          title: 'Odčítání',
          description: 'Naučíme se odčítat větší čísla pomocí písemného odčítání s půjčováním.',
          tips: [
            'Začínáme zprava - od jednotek',
            'Když nemůžeme odečíst, půjčíme si desítku',
            'Půjčenou desítku musíme odečíst od dalšího sloupce',
          ],
        };
      case 'multiplication':
        return {
          title: 'Násobení',
          description: 'Naučíme se násobit větší čísla jednou číslicí pomocí písemného násobení.',
          tips: [
            'Násobíme každou číslici zvlášť',
            'Začínáme zprava',
            'Pamatujeme na přenos desítek',
          ],
        };
      case 'division':
        return {
          title: 'Dělení',
          description: 'Naučíme se dělit větší čísla jednou číslicí.',
          tips: [
            'Ptáme se: kolikrát se tam vejde?',
            'Začínáme zleva',
            'Zbytek připojíme k další číslici',
          ],
        };
      case 'rounding':
        return {
          title: 'Zaokrouhlování',
          description: 'Naučíme se zaokrouhlovat čísla na desítky, stovky a tisíce.',
          tips: [
            'Podíváme se na číslici vpravo od zaokrouhlované pozice',
            '0, 1, 2, 3, 4 → zaokrouhlujeme dolů',
            '5, 6, 7, 8, 9 → zaokrouhlujeme nahoru',
          ],
        };
      default:
        return { title: '', description: '', tips: [] };
    }
  };

  const startDemo = () => {
    const newProblem = generateProblem(validTopic, 2);
    setProblem(newProblem);
    setCurrentStep(0);
    setPhase('demo');
  };

  const getDemoSteps = (): StepData[] => {
    if (!problem) return [];

    const { operand1, operand2, correctAnswer } = problem;
    const op1Str = operand1.toString();
    const op2Str = operand2.toString().padStart(op1Str.length, '0');
    const resultStr = correctAnswer.toString();

    switch (validTopic) {
      case 'addition': {
        const steps: StepData[] = [
          { narration: `Budeme sčítat ${operand1} + ${operand2}. Napíšeme čísla pod sebe.` },
        ];

        let carry = 0;
        for (let i = op1Str.length - 1; i >= 0; i--) {
          const d1 = parseInt(op1Str[i]);
          const d2 = parseInt(op2Str[i]);
          const sum = d1 + d2 + carry;
          const posName = i === op1Str.length - 1 ? 'jednotky' : i === op1Str.length - 2 ? 'desítky' : i === op1Str.length - 3 ? 'stovky' : 'tisíce';

          if (sum >= 10) {
            steps.push({
              narration: `${d1} + ${d2}${carry ? ' + 1' : ''} = ${sum}. Píšeme ${sum % 10} a přenášíme 1.`,
              highlightColumn: i,
              showCarry: true,
              carryValue: 1,
              result: resultStr.slice(i),
            });
            carry = 1;
          } else {
            steps.push({
              narration: `${posName}: ${d1} + ${d2}${carry ? ' + 1' : ''} = ${sum}. Píšeme ${sum}.`,
              highlightColumn: i,
              result: resultStr.slice(i),
            });
            carry = 0;
          }
        }

        steps.push({ narration: `Výborně! Výsledek je ${correctAnswer}.`, result: resultStr });
        return steps;
      }

      case 'subtraction': {
        const steps: StepData[] = [
          { narration: `Budeme odčítat ${operand1} - ${operand2}. Napíšeme čísla pod sebe.` },
        ];

        // Simplified subtraction demo
        steps.push({ narration: `Odčítáme postupně zprava doleva.` });
        steps.push({ narration: `Pokud je horní číslice menší, půjčíme si desítku.` });
        steps.push({ narration: `Výsledek je ${correctAnswer}.`, result: resultStr });
        return steps;
      }

      default:
        return [
          { narration: `Řešíme příklad: ${operand1} ${problem.operator} ${operand2}` },
          { narration: `Výsledek je ${correctAnswer}.` },
        ];
    }
  };

  const nextDemoStep = () => {
    const steps = getDemoSteps();
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Move to interactive phase
      const newProblem = generateProblem(validTopic, 1);
      setProblem(newProblem);
      setInteractiveStep(0);
      setUserInput('');
      setPhase('interactive');
    }
  };

  const handleInteractiveSubmit = () => {
    if (!problem) return;

    const answer = parseInt(userInput, 10);
    if (answer === problem.correctAnswer) {
      setPracticeCount((c) => c + 1);
      if (practiceCount + 1 >= 3) {
        setPhase('complete');
      } else {
        // Next problem
        const newProblem = generateProblem(validTopic, 1);
        setProblem(newProblem);
        setUserInput('');
      }
    } else {
      // Wrong - show hint
      setInteractiveStep(1);
    }
  };

  const introContent = getIntroContent();
  const demoSteps = getDemoSteps();

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            className={styles.introPhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1>{introContent.title}</h1>
            <p className={styles.description}>{introContent.description}</p>
            <div className={styles.tips}>
              <h3>Co si zapamatovat:</h3>
              <ul>
                {introContent.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
            <button className={styles.primaryButton} onClick={startDemo}>
              Ukázat příklad
            </button>
          </motion.div>
        )}

        {phase === 'demo' && problem && (
          <motion.div
            key="demo"
            className={styles.demoPhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.problemDisplay}>
              <div className={styles.columnProblem}>
                <div className={styles.row}>{problem.operand1}</div>
                <div className={styles.row}>
                  <span className={styles.operator}>{problem.operator}</span>
                  {problem.operand2}
                </div>
                <div className={styles.line} />
                {demoSteps[currentStep]?.result && (
                  <div className={styles.row}>{demoSteps[currentStep].result}</div>
                )}
              </div>
            </div>

            <div className={styles.narration}>
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {demoSteps[currentStep]?.narration}
              </motion.p>
            </div>

            <button className={styles.primaryButton} onClick={nextDemoStep}>
              {currentStep < demoSteps.length - 1 ? 'Další krok' : 'Zkusit si to'}
            </button>
          </motion.div>
        )}

        {phase === 'interactive' && problem && (
          <motion.div
            key="interactive"
            className={styles.interactivePhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2>Teď ty! ({practiceCount + 1}/3)</h2>
            <div className={styles.problemDisplay}>
              <span className={styles.equation}>
                {problem.operand1} {problem.operator} {problem.operand2} =
              </span>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.replace(/[^0-9-]/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleInteractiveSubmit()}
                autoFocus
                placeholder="?"
              />
            </div>

            {interactiveStep === 1 && (
              <p className={styles.hint}>Zkus to znovu. Tip: Projdi si to krok po kroku.</p>
            )}

            <button
              className={styles.primaryButton}
              onClick={handleInteractiveSubmit}
              disabled={!userInput}
            >
              Zkontrolovat
            </button>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            key="complete"
            className={styles.completePhase}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className={styles.successIcon}>🎉</div>
            <h1>Výborně!</h1>
            <p>Zvládl/a jsi {topicNames[validTopic].toLowerCase()}!</p>
            <div className={styles.completeButtons}>
              <button
                className={styles.secondaryButton}
                onClick={() => navigate('/child')}
              >
                Zpět na výběr
              </button>
              <button
                className={styles.primaryButton}
                onClick={() => navigate(`/practice/${validTopic}`)}
              >
                Procvičovat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
