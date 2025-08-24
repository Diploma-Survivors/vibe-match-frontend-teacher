export interface Problem {
  id: string;
  title: string;
  group: string;
  category: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
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

export interface ProblemData {
  name: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  timeLimit: string;
  memoryLimit: string;
  difficulty: string;
  topic: string;
  tags: string[];
  accessRange: string;
  testCases: TestCase[];
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
  { value: "all", label: "Tất cả" },
  { value: "Dễ", label: "Dễ" },
  { value: "Trung bình", label: "Trung bình" },
  { value: "Khó", label: "Khó" },
];

export const TOPIC_OPTIONS = [
  { value: "all", label: "Lập trình cơ bản" },
  { value: "Cấu trúc dữ liệu", label: "Cấu trúc dữ liệu" },
  { value: "Thuật toán", label: "Thuật toán" },
];

export const TAG_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "toán học", label: "Toán học" },
  { value: "số học", label: "Số học" },
  { value: "chia hết", label: "Chia hết" },
  { value: "số nguyên tố", label: "Số nguyên tố" },
  { value: "sinh đôi", label: "Sinh đôi" },
  { value: "mảng", label: "Mảng" },
  { value: "trung bình", label: "Trung bình" },
  { value: "sắp xếp", label: "Sắp xếp" },
  { value: "tìm kiếm", label: "Tìm kiếm" },
];

export const ACCESS_RANGE_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];
