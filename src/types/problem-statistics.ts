import { ProgrammingLanguage } from "./languages";

export interface VerdictCount {
  verdict: string; // 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', etc.
  count: number;
  percentage: number;
}

export interface DistributionBucket {
  range: string; // e.g., "0-5ms", "10-20MB"
  value: number; // The start value for sorting/axis
  count: number;
  percentile?: number; // For "Beats X% of users"
}

export interface LanguageStat {
  language: ProgrammingLanguage;
  submissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
  averageRuntime: number;
  averageMemory: number;
}

export interface ProblemStatistics {
  problemId: number;
  totalSubmissions: number;
  totalAccepted: number;
  acceptanceRate: number;
  totalAttempts: number;
  totalSolved: number;
  averageTimeToSolve: number; // in ms
  verdicts: VerdictCount[];
  runtimeDistribution: DistributionBucket[];
  memoryDistribution: DistributionBucket[];
  languageStats: LanguageStat[];
}
