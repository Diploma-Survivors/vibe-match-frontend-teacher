import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TestcaseSample, TestcaseSampleSchema } from "@/types/testcases";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { on } from "events";
import { TestCaseTextArea } from "./testcase-textarea";
import { Pagination } from "../ui/pagination";

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
    errorMessage
}: SampleTestcasesProps
) {
    const [currentTestCases, setCurrentTestCases] = useState<TestcaseSample[]>(sampleTestcases);
    const [currentTestPage, setCurrentTestPage] = useState(1);
    const TEST_CASES_PER_PAGE = 3;
    const totalTestPages = Math.ceil(
        sampleTestcases.length / TEST_CASES_PER_PAGE
    );

    const addTestCase = () => {
        const newTestCases = [
            ...sampleTestcases,
            { input: "", output: "" },
        ];
        setCurrentTestCases(newTestCases);
    }

    useEffect(() => {
        onChange(currentTestCases);
    }, [ currentTestCases]);

    const removeTestCase = (index: number) => {
        const newTestCases = currentTestCases.filter((_, i) => i !== index);
        setCurrentTestCases(newTestCases);
    }

    const handleTestCaseChange = (index: number, field: 'input' | 'output', value: string) => {
        const newTestCases = [...currentTestCases];
        newTestCases[index] = {
            ...newTestCases[index],
            [field]: value,
        };
        setCurrentTestCases(newTestCases);
    }


    return (
        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        Test Cases Mẫu ({sampleTestcases.length})
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
                    const actualIndex = (currentTestPage - 1) * TEST_CASES_PER_PAGE + index;
                    return (
                        <div
                            key={actualIndex}
                            className="p-6 bg-gradient-to-r from-slate-50/50 to-blue-50/30 dark:from-slate-700/30 dark:to-blue-900/20 rounded-xl border border-slate-200/50 dark:border-slate-600/50"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                    Test Case {actualIndex + 1}
                                </h3>
                                {!isReadOnly && (
                                        <Button
                                            type="button"
                                            onClick={() => removeTestCase(actualIndex)}
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Input */}
                                <div className="space-y-2">
                                    <TestCaseTextArea
                                        label="Đầu vào"
                                        value={testCase.input}
                                        placeholder="Nhập dữ liệu đầu vào..."
                                        required
                                        onChange={(val) => handleTestCaseChange(actualIndex, "input", val)}
                                    />
                                </div>

                                {/* Expected Output */}
                                <div className="space-y-2">
                                    <TestCaseTextArea
                                        label="Đầu ra"
                                        value={testCase.output}
                                        placeholder="Nhập dữ liệu đầu ra..."
                                        required
                                        onChange={(val) => handleTestCaseChange(actualIndex, "output", val)}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Test Cases Pagination */}
                {totalTestPages > 1 && (
                    <Pagination
                        currentPage={currentTestPage}
                        totalPages={totalTestPages}
                        onPageChange={setCurrentTestPage}
                    />
                )}
                {errorMessage && (
                    <p className="text-sm text-red-500">{errorMessage}</p>
                )}                
            </CardContent>
        </Card>
    )
}