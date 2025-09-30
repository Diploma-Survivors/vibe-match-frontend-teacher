export interface Problem {
  id: string;
  title: string;
  group: string;
  category: string;
  difficulty: ProblemDifficulty;
  acceptanceRate: number;
  submissionCount: number;
  tags: string[];
  topic: string;
  problemType: string;
  accessRange: "public" | "private";
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
}

export interface TestcaseSample {
  input: string;
  output: string;
}

export interface ProblemData {
  title: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  maxScore: number;
  timeLimitMs: number;
  memoryLimitKb: number;
  difficulty: ProblemDifficulty;
  tags: string[]; // Array of tag IDs
  topics: string[]; // Array of topic IDs
  testcase: string; // Main testcase ID
  testcaseSamples: TestcaseSample[];
}

export enum ProblemDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProblemFilters {
  id?: string;
  title?: string;
  difficulty?: string;
  topic?: string;
  tags?: string[];
  accessRange?: string;
}

export const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Dễ" },
  { value: "medium", label: "Trung bình" },
  { value: "hard", label: "Khó" },
];

// Temporary constants - will be replaced by dynamic data from backend
export const TOPIC_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "algorithms", label: "Thuật toán" },
  { value: "data-structures", label: "Cấu trúc dữ liệu" },
  { value: "math", label: "Toán học" },
];

export const TAG_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "easy", label: "Dễ" },
  { value: "medium", label: "Trung bình" },
  { value: "hard", label: "Khó" },
];

// Remove TOPIC_OPTIONS and TAG_OPTIONS as they will be fetched from backend
// Keep ACCESS_RANGE_OPTIONS for potential future use
export const ACCESS_RANGE_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];