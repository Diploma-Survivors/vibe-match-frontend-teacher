import type { TestcaseSample } from '@/types/testcases';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TestCaseTextArea } from './testcase-textarea';

interface SampleTestcasesProps {
  readonly sampleTestcases?: TestcaseSample[];
  readonly onChange: (samples: TestcaseSample[]) => void;
  readonly errorMessage?: string;
  readonly isReadOnly?: boolean;
}

export default function SampleTestcases({
  sampleTestcases = [],
  onChange,
  isReadOnly = false,
  errorMessage,
}: SampleTestcasesProps) {
  const [currentTestCases, setCurrentTestCases] =
    useState<TestcaseSample[]>(sampleTestcases);

  useEffect(() => {
    onChange(currentTestCases);
  }, [currentTestCases, onChange]);

  const addTestCase = () => {
    const newTestCases = [...sampleTestcases, { input: '', expectedOutput: '' }];
    setCurrentTestCases(newTestCases);
  };

  const removeTestCase = (index: number) => {
    const newTestCases = currentTestCases.filter((_, i) => i !== index);
    setCurrentTestCases(newTestCases);
  };

  const handleTestCaseChange = (
    index: number,
    field: 'input' | 'expectedOutput',
    value: string
  ) => {
    const newTestCases = [...currentTestCases];
    newTestCases[index] = {
      ...newTestCases[index],
      [field]: value,
    };
    setCurrentTestCases(newTestCases);
  };

  return (
    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Test Cases Mẫu ({currentTestCases.length})
          </CardTitle>
          {!isReadOnly && (
            <Button
              type="button"
              onClick={addTestCase}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm test case
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Cases Display */}
        {currentTestCases.map((testCase, index) => {
          return (
            <div
              key={testCase.id}
              className="p-4 bg-gradient-to-r from-slate-50/50 to-blue-50/30 dark:from-slate-700/30 dark:to-blue-900/20 rounded-xl border border-slate-200/50 dark:border-slate-600/50 "
              style={{ marginBlockEnd: '1em' }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Test Case {index + 1}
                </h3>
                {!isReadOnly && (
                  <Button
                    type="button"
                    onClick={() => removeTestCase(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Input */}
                <div className="space-y-2">
                  <TestCaseTextArea
                    isReadOnly={isReadOnly}
                    label="Đầu vào"
                    value={testCase.input}
                    placeholder="Nhập dữ liệu đầu vào..."
                    required
                    onChange={(val) =>
                      handleTestCaseChange(index, 'input', val)
                    }
                  />
                </div>

                {/* Expected Output */}
                <div className="space-y-2">
                  <TestCaseTextArea
                    isReadOnly={isReadOnly}
                    label="Đầu ra"
                    value={testCase.expectedOutput}
                    placeholder="Nhập dữ liệu đầu ra..."
                    required
                    onChange={(val) =>
                      handleTestCaseChange(index, 'expectedOutput', val)
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      </CardContent>
    </Card>
  );
}
