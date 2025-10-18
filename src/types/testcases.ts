export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isSample: boolean;
}

export interface TestcaseSample {
  input: string;
  output: string;
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
