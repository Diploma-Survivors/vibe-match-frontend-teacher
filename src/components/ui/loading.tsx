"use client";

import { Loader2 } from "lucide-react";

interface LoadingProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function Loading({ 
  title = "Đang tải...", 
  description = "Vui lòng chờ trong giây lát",
  className = ""
}: LoadingProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto animate-ping opacity-20"></div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}