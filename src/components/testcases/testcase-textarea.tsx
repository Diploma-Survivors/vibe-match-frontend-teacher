import { useState } from 'react';

interface TestCaseTextAreaProps {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly isReadOnly?: boolean;
  readonly required?: boolean;
}

export function TestCaseTextArea({
  label,
  value,
  onChange,
  placeholder = '',
  isReadOnly = false,
  required = false,
}: TestCaseTextAreaProps) {
  const [error, setError] = useState('');

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.trim();

    if (required && val === '') {
      setError('Trường này không được để trống');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onBlur={handleBlur}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          onChange(target.value);
        }}
        className="w-full h-16 p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-green-500 resize-none text-sm font-mono"
        disabled={isReadOnly}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
