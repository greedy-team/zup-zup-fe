export type LostItemBrief = {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryIconUrl: string;
  schoolAreaId: number;
  schoolAreaName: string;
  foundAreaDetail: string;
  createdAt: string;
  representativeImageUrl: string;
};

export type QuizOption = { id: number; text: string };

export type QuizItem = { featureId: number; question: string; options: QuizOption[] };

export type GetQuizzesResponse = { quizzes: QuizItem[] };

export type QuizSubmitBody = {
  answers: { featureId: number; selectedOptionId: number }[];
};

export type DetailResponse = {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryIconUrl: string;
  schoolAreaId: number;
  schoolAreaName: string;
  foundAreaDetail: string;
  description: string;
  imageUrls: string[];
  createdAt: string;
};

export type DepositAreaResponse = {
  depositArea: string;
};

export type BeforeNextHandler = () => boolean | Promise<boolean>;

export type FindOutletContext = {
  setBeforeNext: (handler: BeforeNextHandler | null) => void;
};
