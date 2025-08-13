import { lostItems, type LostItem } from '../db/lostItems.db';
import { categoryFeatures, type FeatureDef } from '../db/features.db';

const QUESTION_COUNT = 2;
const OPTIONS_PER_QUESTION = 4;

export type QuizOption = { id: number; text: string };
export type QuizItem = { featureId: number; question: string; options: QuizOption[] };

export type QuizAnswer = { featureId: number; selectedOptionId: number };
export type QuizSubmitBody = { answers: QuizAnswer[] };

export type QuizResult =
  | { correct: true; detail: { imageUrl: string; description?: string | null } }
  | { correct: false };

function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sample<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) return arr.slice();
  return shuffle(arr).slice(0, n);
}

function findFeatureDef(categoryId: number, featureId: number): FeatureDef | undefined {
  const category = categoryFeatures.find((c) => c.categoryId === categoryId);
  return category?.features.find((f) => f.featureId === featureId);
}

export function buildQuizForLostItem(lostItemId: number): QuizItem[] | undefined {
  const lostItem: LostItem | undefined = lostItems.find((item) => item.lostItemId === lostItemId);
  if (!lostItem) return undefined;

  const selectedFeatures = lostItem.features ?? [];
  if (selectedFeatures.length === 0) return [];

  const pickedFeatures = sample(selectedFeatures, QUESTION_COUNT);
  const quizItems: QuizItem[] = [];

  for (const featureSelection of pickedFeatures) {
    const featureDef = findFeatureDef(lostItem.categoryId, featureSelection.featureId);
    if (!featureDef || featureDef.options.length === 0) continue;

    const answerOption = featureDef.options.find((o) => o.optionId === featureSelection.optionId);
    if (!answerOption) continue;

    const wrongOptionPool = featureDef.options.filter(
      (option) => option.optionId !== featureSelection.optionId,
    );
    const wrongOptions = sample(wrongOptionPool, Math.max(0, OPTIONS_PER_QUESTION - 1));

    const choices: QuizOption[] = shuffle<QuizOption>([
      { id: answerOption.optionId, text: answerOption.text },
      ...wrongOptions.map((option) => ({ id: option.optionId, text: option.text })),
    ]).slice(0, OPTIONS_PER_QUESTION);

    quizItems.push({
      featureId: featureDef.featureId,
      question: featureDef.quizQuestion,
      options: choices,
    });
  }

  return quizItems;
}

export function submitQuizForLostItem(
  lostItemId: number,
  body: QuizSubmitBody,
): QuizResult | undefined {
  const targetLostItem = lostItems.find((item) => item.lostItemId === lostItemId);
  if (!targetLostItem) return undefined;

  const submittedAnswers = body?.answers ?? [];
  if (submittedAnswers.length === 0) return { correct: false };

  const correctFeatureSelections = targetLostItem.features ?? [];

  const allCorrect = submittedAnswers.every(({ featureId, selectedOptionId }) => {
    const correctSelection = correctFeatureSelections.find(
      (selection) => selection.featureId === featureId,
    );
    return Boolean(correctSelection) && correctSelection?.optionId === selectedOptionId;
  });

  if (!allCorrect) return { correct: false };

  return {
    correct: true,
    detail: {
      imageUrl: targetLostItem.imageUrl,
      description: targetLostItem.description ?? null,
    },
  };
}
