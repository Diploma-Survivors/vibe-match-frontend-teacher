'use client';

import { ContestsService } from '@/services/contests-service';
import type { Contest } from '@/types/contest';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ProblemStatusData {
  problem: string;
  AC: number;
  WA: number;
  CE: number;
  TLE: number;
  ERR: number;
  total: number;
}

interface ACRatioData {
  problem: string;
  ratio: number;
}

interface LanguageSubmissionData {
  language: string;
  value: number;
  [key: string]: string | number;
}

interface LanguageACRatioData {
  language: string;
  ratio: number;
}

const COLORS = {
  AC: '#22c55e', // green
  WA: '#ef4444', // red
  CE: '#475569', // dark blue/grey
  TLE: '#94a3b8', // light blue/grey
  ERR: '#f97316', // orange
};

const LANGUAGE_COLORS = [
  '#3b82f6', // blue - C
  '#f97316', // orange - C++17
  '#dc2626', // red/brown - C++20
  '#22c55e', // green - C11
  '#8b5cf6', // purple - Python 3
  '#ec4899', // pink - C++11
  '#06b6d4', // cyan - PyPy 3
  '#6366f1', // indigo - C++14
  '#14b8a6', // teal - Java 19
  '#f59e0b', // amber - Pascal
  '#84cc16', // lime - C++03
  '#10b981', // emerald - Java 8
];

export default function ContestStatsPage() {
  const params = useParams();
  const contestId = params.id as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [problemStatusData, setProblemStatusData] = useState<
    ProblemStatusData[]
  >([]);
  const [acRatioData, setAcRatioData] = useState<ACRatioData[]>([]);
  const [languageSubmissionData, setLanguageSubmissionData] = useState<
    LanguageSubmissionData[]
  >([]);
  const [languageACRatioData, setLanguageACRatioData] = useState<
    LanguageACRatioData[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ContestsService.getContestById(contestId);
      setContest(response?.data?.data);

      // Mock data for demo
      const mockProblemStatus: ProblemStatusData[] = [
        {
          problem: '[Vòng Lặp] Bài 1',
          AC: 380,
          WA: 250,
          CE: 120,
          TLE: 80,
          ERR: 45,
          total: 875,
        },
        {
          problem: '[Mảng 1 Chiều Cơ Bản] Bài 2',
          AC: 320,
          WA: 420,
          CE: 180,
          TLE: 95,
          ERR: 60,
          total: 1075,
        },
        {
          problem: '[Mảng 2 Chiều] Bài 3',
          AC: 280,
          WA: 380,
          CE: 200,
          TLE: 120,
          ERR: 75,
          total: 1055,
        },
        {
          problem: '[Xâu Ký Tự] Bài 4',
          AC: 250,
          WA: 350,
          CE: 150,
          TLE: 100,
          ERR: 50,
          total: 900,
        },
        {
          problem: '[Struct] Bài 5',
          AC: 200,
          WA: 300,
          CE: 140,
          TLE: 90,
          ERR: 40,
          total: 770,
        },
      ];

      const mockACRatio: ACRatioData[] = [
        { problem: '[Vòng Lặp] Bài 1', ratio: 43.4 },
        { problem: '[Mảng 1 Chiều Cơ Bản] Bài 2', ratio: 29.8 },
        { problem: '[Mảng 2 Chiều] Bài 3', ratio: 26.5 },
        { problem: '[Xâu Ký Tự] Bài 4', ratio: 27.8 },
        { problem: '[Struct] Bài 5', ratio: 26.0 },
      ];

      const mockLanguageSubmission: LanguageSubmissionData[] = [
        { language: 'C', value: 450 },
        { language: 'C++17', value: 380 },
        { language: 'C++20', value: 320 },
        { language: 'C11', value: 280 },
        { language: 'Python 3', value: 250 },
        { language: 'C++11', value: 180 },
        { language: 'PyPy 3', value: 120 },
        { language: 'C++14', value: 95 },
        { language: 'Java 19', value: 85 },
        { language: 'Pascal', value: 65 },
        { language: 'C++03', value: 45 },
        { language: 'Java 8', value: 35 },
      ];

      const mockLanguageACRatio: LanguageACRatioData[] = [
        { language: 'C', ratio: 28.5 },
        { language: 'Python 3', ratio: 25.2 },
        { language: 'C++17', ratio: 32.1 },
        { language: 'C++20', ratio: 29.8 },
        { language: 'C11', ratio: 31.4 },
        { language: 'PyPy 3', ratio: 26.7 },
        { language: 'C++14', ratio: 95.2 },
        { language: 'C++11', ratio: 88.5 },
        { language: 'C++03', ratio: 97.8 },
      ];

      setProblemStatusData(mockProblemStatus);
      setAcRatioData(mockACRatio);
      setLanguageSubmissionData(mockLanguageSubmission);
      setLanguageACRatioData(mockLanguageACRatio);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalSubmissions = problemStatusData.reduce(
    (sum, item) => sum + item.total,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="border border-gray-300 p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy cuộc thi
          </h2>
          <p className="text-gray-600">
            Cuộc thi này không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 w-full">
      <div className="w-full px-4 space-y-8">
        {/* Phân phối theo trạng thái */}
        <div className="border border-gray-300 bg-white p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Phân phối theo trạng thái
          </h2>
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: COLORS.AC }}
                />
                <span className="font-semibold">AC</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: COLORS.WA }}
                />
                <span className="font-semibold">WA</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: COLORS.CE }}
                />
                <span className="font-semibold">CE</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: COLORS.TLE }}
                />
                <span className="font-semibold">TLE</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: COLORS.ERR }}
                />
                <span className="font-semibold">ERR</span>
              </div>
              <span className="ml-4 font-semibold">
                Total: {totalSubmissions}
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={problemStatusData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                stroke="#666"
                tick={{ fontWeight: 'bold' }}
              />
              <YAxis
                type="category"
                dataKey="problem"
                stroke="#666"
                width={180}
                tick={{ fontSize: 12, fontWeight: 'bold' }}
              />
              <Tooltip
                contentStyle={{ fontWeight: 'bold' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Bar dataKey="AC" stackId="a" fill={COLORS.AC} />
              <Bar dataKey="WA" stackId="a" fill={COLORS.WA} />
              <Bar dataKey="CE" stackId="a" fill={COLORS.CE} />
              <Bar dataKey="TLE" stackId="a" fill={COLORS.TLE} />
              <Bar dataKey="ERR" stackId="a" fill={COLORS.ERR} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tỉ lệ AC */}
        <div className="border border-gray-300 bg-white p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tỉ lệ AC</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={acRatioData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                domain={[0, 50]}
                stroke="#666"
                tick={{ fontWeight: 'bold' }}
              />
              <YAxis
                type="category"
                dataKey="problem"
                stroke="#666"
                width={180}
                tick={{ fontSize: 12, fontWeight: 'bold' }}
              />
              <Tooltip
                contentStyle={{ fontWeight: 'bold' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Bar dataKey="ratio" fill="#94a3b8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bài nộp theo ngôn ngữ + Tỉ lệ AC theo ngôn ngữ (2 cột) */}
        <div className="grid grid-cols-2 gap-8">
          {/* Bài nộp theo ngôn ngữ */}
          <div className="border border-gray-300 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Bài nộp theo ngôn ngữ
            </h2>
            <div className="flex gap-8">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={languageSubmissionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {languageSubmissionData.map((entry) => (
                        <Cell
                          key={entry.language}
                          fill={
                            LANGUAGE_COLORS[
                              languageSubmissionData.indexOf(entry) %
                                LANGUAGE_COLORS.length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ fontWeight: 'bold' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                {languageSubmissionData.map((entry, index) => (
                  <div
                    key={entry.language}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className="w-4 h-4"
                      style={{
                        backgroundColor:
                          LANGUAGE_COLORS[index % LANGUAGE_COLORS.length],
                      }}
                    />
                    <span className="font-semibold">{entry.language}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tỉ lệ AC theo ngôn ngữ */}
          <div className="border border-gray-300 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Tỉ lệ AC theo ngôn ngữ
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={languageACRatioData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="#666"
                  tick={{ fontWeight: 'bold' }}
                />
                <YAxis
                  type="category"
                  dataKey="language"
                  stroke="#666"
                  width={80}
                  tick={{ fontSize: 12, fontWeight: 'bold' }}
                  tickMargin={6}
                />
                <Tooltip
                  contentStyle={{ fontWeight: 'bold' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="ratio" fill="#94a3b8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
