"use client";

import { Button } from "@/components/ui/button";
import ProblemForm from "@/components/problem-form-new";
import { ProblemData, ProblemDifficulty } from "@/types/problem";
import { problemApi } from "@/lib/apis/problem-api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProblemPage() {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const initialData: ProblemData = {
    title: "",
    description: "",
    inputDescription: "",
    outputDescription: "",
    maxScore: 100,
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    difficulty: ProblemDifficulty.EASY,
    tags: [],
    topics: [],
    testcase: "",
    testcaseSamples: [
      {
        input: "",
        output: "",
      },
    ],
  };

  const handleSave = async (data: ProblemData) => {
    setIsSaving(true);
    try {
      // STEP 2: Create problem with /problems endpoint using testcase ID from step 1
      // Sends: title, description, inputDescription, outputDescription, maxScore,
      // timeLimitMs, memoryLimitKb, difficulty, tagIds, topicIds, testcaseId, testcaseSamples
      const result = await problemApi.createProblem(data, data.testcase);
      console.log("Problem created successfully:", result);

      // STEP 3: Handle deep linking response
      if (result.id) {
        try {
          await problemApi.sendDeepLinkingResponse(result.id);
          console.log("Deep linking response sent successfully");
        } catch (dlError) {
          console.error("Failed to send deep linking response:", dlError);
          // Continue even if deep linking fails
        }

        // Redirect to the newly created problem's detail page
        // router.push(`/problems/${result.id}`);
      } else {
        // Fallback to problems list if no ID is returned
        router.push("/problems");
      }
    } catch (error) {
      console.error("Failed to create problem:", error);
      // You might want to show a toast notification here
      alert("Failed to create problem. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/problems">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại danh sách
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <ProblemForm
          initialData={initialData}
          mode="create"
          onSave={handleSave}
          isSaving={isSaving}
          title="Tạo bài tập mới"
          subtitle="Tạo bài tập lập trình cho học sinh"
        />
      </div>
    </div>
  );
}
