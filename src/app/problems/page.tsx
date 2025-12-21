'use client';

import ProblemList from '@/components/problem-list';
import { Button } from '@/components/ui/button';
import { ProblemEndpointType } from '@/types/problems';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProblemsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header Section */}
      <div className="dark:bg-slate-800 dark:border-slate-700">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-6">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Problem list
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Manage problem with sFinx.
                </p>
              </div>

              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/problems/create">
                  <Plus className="w-5 h-5 mr-2" />
                  Create new problem
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ProblemList
        endpointType={ProblemEndpointType.PROBLEM_MANAGEMENT}
      />
    </div>
  );
}
