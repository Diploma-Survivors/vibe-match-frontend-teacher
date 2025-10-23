import z from "zod";

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

export const TestcaseSampleSchema = z.object({
  input: z.string().min(1, "Input không được để trống"),
  output: z.string().min(1, "Output không được để trống"),
});

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
