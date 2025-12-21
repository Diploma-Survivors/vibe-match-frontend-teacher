export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isSample: boolean;
}

export interface TestcaseSample {
  id?: number;
  problem?: string;
  input: string;
  expectedOutput: string;
  orderIndex?: number;
  explanation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTestcaseRequest {
  testcases: TestcaseSample[];
}

export interface CreateTestcaseFileResponse {
  id: number;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTestcaseResponse {
  id: number;
  // Add other fields as returned by backend
}

export interface TestcaseInput {
  input: string;
  output: string;
}
