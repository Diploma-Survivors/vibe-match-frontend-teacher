import { Button } from '@/components/ui/button';
import { ProblemsService } from '@/services/problems-service';
import type { ProblemData } from '@/types/problems';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ProblemDetailModalProps {
  problemId: number;
  onClose: () => void;
}

export default function ProblemDetailModal({
  problemId,
  onClose,
}: ProblemDetailModalProps) {
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblemDetail = async () => {
      try {
        setLoading(true);
        const response = await ProblemsService.getProblemById(problemId);
        setProblem(response.data.data);
      } catch (error) {
        console.error('Error fetching problem detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDetail();
  }, [problemId]);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-300 flex items-center justify-between bg-gray-800">
          <h2 className="text-xl font-bold text-white">Chi tiết bài tập</h2>
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="space-y-6">
              <div>
                <Skeleton width="60%" height={32} className="mb-2" />
                <Skeleton width={100} height={20} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height={80} />
                ))}
              </div>
              <div>
                <Skeleton width={150} height={24} className="mb-3" />
                <Skeleton count={5} />
              </div>
            </div>
          ) : problem ? (
            <div className="space-y-6">
              {/* Problem Title */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {problem.title}
                </h3>
              </div>

              {/* Problem Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">
                    Thời gian giới hạn
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {problem.timeLimitMs}ms
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Bộ nhớ giới hạn</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {Math.round(problem.memoryLimitKb / 1024)}MB
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Điểm tối đa</p>
                  <p className="text-lg font-semibold text-green-600">
                    {problem.maxScore}
                  </p>
                </div>

                {problem.difficulty && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Độ khó</p>
                    <p className="text-lg font-semibold text-gray-800 capitalize">
                      {problem.difficulty}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {problem.description && (
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-3">
                    Mô tả bài tập
                  </h4>
                  <div className="prose max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {problem.description}
                    </div>
                  </div>
                </div>
              )}

              {/* Input Description */}
              {problem.inputDescription && (
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-3">
                    Mô tả đầu vào
                  </h4>
                  <div className="prose max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {problem.inputDescription}
                    </div>
                  </div>
                </div>
              )}

              {/* Output Description */}
              {problem.outputDescription && (
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-3">
                    Mô tả đầu ra
                  </h4>
                  <div className="prose max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {problem.outputDescription}
                    </div>
                  </div>
                </div>
              )}

              {/* Sample Testcases */}
              {problem.testcaseSamples &&
                problem.testcaseSamples.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      Test case mẫu
                    </h4>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-800">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white w-16">
                              #
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                              Input
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                              Output
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {problem.testcaseSamples.map((testcase, index) => (
                            <tr
                              key={`${testcase.input}-${testcase.output}-${index}`}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm font-semibold text-gray-600">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3">
                                <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-words">
                                  {testcase.input}
                                </pre>
                              </td>
                              <td className="px-4 py-3">
                                <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-words">
                                  {testcase.output}
                                </pre>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Tags */}
              {problem.tags && problem.tags.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics */}
              {problem.topics && problem.topics.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-3">
                    Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {problem.topics.map((topic) => (
                      <span
                        key={topic.id}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                      >
                        {topic.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Không thể tải thông tin bài tập</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
