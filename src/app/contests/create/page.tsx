"use client";

import { Button } from "@/components/ui/button";
import ContestForm from "@/components/contest-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ContestData {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  accessRange: string;
  problems: string[];
}

export default function CreateContestPage() {
  const [isSaving, setIsSaving] = useState(false);

  const initialData: ContestData = {
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    duration: 180,
    accessRange: "public",
    problems: [],
  };

  const handleSave = async (data: ContestData) => {
    setIsSaving(true);
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Creating contest:", data);
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
              <Link href="/contests">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400"
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
        <ContestForm
          initialData={initialData}
          mode="create"
          onSave={handleSave}
          isSaving={isSaving}
          title="Tạo cuộc thi mới"
          subtitle="Thiết lập thông tin và cấu hình cuộc thi lập trình"
        />
      </div>
    </div>
  );
}
