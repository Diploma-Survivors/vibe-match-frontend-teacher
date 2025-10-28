'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  validateTestcaseFileContent,
  validateTestcaseFileFormat,
} from '@/lib/utils/testcase-file-validations';
import { AllowedExtensions, type TestcaseFileResponse } from '@/types/problems';
import { Download, FileText, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { set } from 'zod';

interface TestCaseUploaderProps {
  value: File | null;
  onChange: (file: File | null) => void;
  onError: (message: string | null) => void;
  errorMessage?: string;
  isReadOnly?: boolean;
  title?: string;
  testCaseResponse?: TestcaseFileResponse;
}

export default function TestCaseUploader({
  value,
  onChange,
  onError,
  errorMessage,
  isReadOnly = false,
  title = 'Test Cases File',
  testCaseResponse,
}: TestCaseUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File | undefined) => {
    if (!file) return;

    setIsProcessing(true);
    const validationResult = validateTestcaseFileFormat(file);

    if (!validationResult.isValid) {
      onChange(null); // Clear the invalid file from the form state
      onError(validationResult.error ?? 'Lỗi khi upload file.');
      setIsProcessing(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const contentValidation = validateTestcaseFileContent(content);

      if (contentValidation.isValid) {
        onChange(file);
        onError(null);
      } else {
        onChange(null);
        onError(contentValidation.error ?? 'Nội dung file không hợp lệ.');
      }
      setIsProcessing(false);
    };

    reader.onerror = () => {
      onChange(null);
      onError('Lỗi khi đọc file.');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  // --- Event Handlers ---

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isReadOnly) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isReadOnly) return;

    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    if (isReadOnly) return;
    onChange(null);
    onError('File test case là bắt buộc.');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
            dragActive && !isProcessing
              ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
              : 'border-slate-300 dark:border-slate-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="text-center space-y-4 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-t-2 border-solid border-green-500 rounded-full animate-spin" />
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Đang xử lý file...
              </p>
            </div>
          ) : value ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full">
                <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {value.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {(value.size / 1024).toFixed(2)} KB
                </p>
                <span className="inline-block px-2 py-1 mt-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
                  {value.name.split('.').pop()?.toUpperCase()}
                </span>
              </div>
              {!isReadOnly && (
                <Button
                  type="button"
                  onClick={removeFile}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                  Xóa file
                </Button>
              )}
            </div>
          ) : isReadOnly && !testCaseResponse ? (
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Không có file test cases nào được tải lên.
              </p>
            </div>
          ) : isReadOnly && testCaseResponse ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                testcases.txt
              </p>
              <a
                href={testCaseResponse.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Download className="w-4 h-4" />
                  Tải xuống file
                </Button>
              </a>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full">
                <Upload className="w-8 h-8 text-slate-500" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Tải lên file test cases
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Kéo thả file .txt vào đây hoặc click để chọn file
                </p>
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="gap-2"
                  disabled={isReadOnly || isProcessing}
                >
                  <Upload className="w-4 h-4" />
                  Chọn file
                </Button>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={AllowedExtensions.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isReadOnly || isProcessing}
          />
        </div>

        {/* Error message display */}
        {errorMessage && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-label="Error icon"
                >
                  <title>Error</title>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
