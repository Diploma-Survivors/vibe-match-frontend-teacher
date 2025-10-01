import clientApi from "@/lib/apis/axios-client";
import { ProblemData, Tag, Topic, TestcaseSample } from "@/types/problem";

export interface CreateTestcaseRequest {
  testcases: TestcaseSample[];
}

export interface CreateTestcaseFileResponse {
  id: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTestcaseResponse {
  id: string;
  // Add other fields as returned by backend
}

export interface CreateProblemRequest {
  title: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  maxScore: number;
  timeLimitMs: number;
  memoryLimitKb: number;
  difficulty: "easy" | "medium" | "hard";
  tagIds: string[];
  topicIds: string[];
  testcaseId: string;
  testcaseSamples: TestcaseSample[];
}

export class ProblemService {
  // Fetch all available tags
  static async getTags(): Promise<Tag[]> {
    try {
      const response = await clientApi.get("/tags");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  }

  // Fetch all available topics
  static async getTopics(): Promise<Topic[]> {
    try {
      const response = await clientApi.get("/topics");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching topics:", error);
      throw error;
    }
  }

  // Create test cases first (returns testcase ID)
  static async createTestcase(
    testcases: TestcaseSample[]
  ): Promise<CreateTestcaseResponse> {
    try {
      const response = await clientApi.post("/testcases", { testcases });
      return response.data.data;
    } catch (error) {
      console.error("Error creating testcase:", error);
      throw error;
    }
  }

  // Create testcase by uploading file
  static async createTestcaseFile(
    file: File
  ): Promise<CreateTestcaseFileResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const response = await clientApi.post("/testcases", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Include cookies if needed
      });
      return response.data.data;
    } catch (error) {
      console.error("Error uploading testcase file:", error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const response = await clientApi.get("/problems");

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }

  // Create problem with testcase ID
  static async createProblem(
    problemData: ProblemData,
    testcaseId: string
  ): Promise<any> {
    try {
      const request: CreateProblemRequest = {
        title: problemData.title,
        description: problemData.description,
        inputDescription: problemData.inputDescription,
        outputDescription: problemData.outputDescription,
        maxScore: problemData.maxScore,
        timeLimitMs: problemData.timeLimitMs,
        memoryLimitKb: problemData.memoryLimitKb,
        difficulty: problemData.difficulty,
        tagIds: problemData.tags,
        topicIds: problemData.topics,
        testcaseId: testcaseId,
        testcaseSamples: problemData.testcaseSamples,
      };

      const response = await clientApi.post("/problems", request, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error creating problem:", error);
      throw error;
    }
  }

  // Complete problem creation workflow
  static async createProblemComplete(
    problemData: ProblemData,
    testcaseFile?: File
  ): Promise<any> {
    try {
      let testcaseId: string;
      let testcaseResponse: CreateTestcaseFileResponse | null = null;

      // If testcaseFile is provided, upload it first
      if (testcaseFile) {
        // Check if we have a cached testcase response for this file
        const cacheKey = `testcase_${testcaseFile.name}_${testcaseFile.size}_${testcaseFile.lastModified}`;
        const cachedResponse = this.getTestcaseFromCache(cacheKey);

        if (cachedResponse) {
          console.log("Using cached testcase response:", cachedResponse);
          testcaseId = cachedResponse.id;
        } else {
          // Upload new testcase and cache the result
          testcaseResponse = await this.createTestcaseFile(testcaseFile);
          testcaseId = testcaseResponse.id;
          this.saveTestcaseToCache(cacheKey, testcaseResponse);
          console.log("Testcase uploaded and cached:", testcaseResponse);
        }
      } else if (problemData.testcase) {
        // Use existing testcase ID if provided
        testcaseId = problemData.testcase;
      } else {
        throw new Error("Either testcase file or testcase ID must be provided");
      }

      // Create problem with the testcase ID
      const problemResponse = await this.createProblem(problemData, testcaseId);

      return problemResponse;
    } catch (error) {
      console.error("Error in complete problem creation:", error);
      throw error;
    }
  }

  // Cache management for testcase responses
  private static testcacheStorage = new Map<
    string,
    CreateTestcaseFileResponse
  >();

  private static saveTestcaseToCache(
    key: string,
    response: CreateTestcaseFileResponse
  ): void {
    this.testcacheStorage.set(key, response);
    // Optional: Set expiration time (e.g., 1 hour)
    setTimeout(
      () => {
        this.testcacheStorage.delete(key);
      },
      60 * 60 * 1000
    ); // 1 hour expiration
  }

  private static getTestcaseFromCache(
    key: string
  ): CreateTestcaseFileResponse | null {
    return this.testcacheStorage.get(key) || null;
  }

  private static clearTestcaseCache(): void {
    this.testcacheStorage.clear();
  }
}
