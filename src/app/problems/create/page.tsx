"use client";

import { Button } from "@/components/ui/button";
import ProblemForm from "@/components/problem-form";
import { ProblemData } from "@/types/problem";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CreateProblemPage() {
  const [isSaving, setIsSaving] = useState(false);

  const initialData: ProblemData = {
    name: "",
    description: "",
    inputDescription: "",
    outputDescription: "",
    timeLimit: "1000",
    memoryLimit: "256",
    difficulty: "",
    topic: "",
    tags: [],
    accessRange: "",
    testCases: [
      {
        id: "1",
        input: "",
        expectedOutput: "",
        isSample: true,
      },
    ],
  };

  const handleSave = async (data: ProblemData) => {
    setIsSaving(true);
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Saving problem:", data);
    setIsSaving(false);
    // Here you would typically save to your backend
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