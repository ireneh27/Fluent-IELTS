export enum AppView {
  DASHBOARD = 'DASHBOARD',
  VOCABULARY = 'VOCABULARY',
  SCAFFOLDING = 'SCAFFOLDING',
  MOCK_TEST = 'MOCK_TEST',
  STUDY_PLAN = 'STUDY_PLAN',
}

export interface VocabWord {
  word: string;
  definition: string;
  example: string;
  synonyms: string[];
}

export interface ScaffoldingTip {
  structure: string[];
  keyPhrases: string[];
  sampleOpener: string;
}

export interface Feedback {
  bandScore: number;
  fluency: string;
  lexicalResource: string;
  grammaticalRange: string;
  pronunciation: string;
  improvedVersion: string;
}

export enum SpeakingPart {
  PART_1 = 'Part 1',
  PART_2 = 'Part 2',
  PART_3 = 'Part 3',
}

export interface MockQuestion {
  id: string;
  text: string;
  part: SpeakingPart;
  topic?: string;
}

export interface StudyDay {
  day: number;
  focus: string;
  activities: string[];
}

export interface StudyPlan {
  currentLevelAssessment: string;
  focusAreas: string[];
  schedule: StudyDay[];
}
