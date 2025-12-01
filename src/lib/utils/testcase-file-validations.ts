import { AllowedExtensions, AllowedTypes } from '@/types/problems';

/**
 * Validates a file based on its MIME type or extension.
 * @param file The file to validate.
 * @returns An object with validation status and an optional error message.
 */
export function validateTestcaseFileFormat(file: File | null): {
  isValid: boolean;
  error?: string;
} {
  if (!file) {
    return { isValid: false, error: 'Không tìm thấy file.' };
  }

  const hasValidType = AllowedTypes.includes(file.type);
  const hasValidExtension = AllowedExtensions.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );

  if (hasValidType || hasValidExtension) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `Định dạng file không hợp lệ. Chỉ chấp nhận: ${AllowedExtensions.join(
      ', '
    )}`,
  };
}

export function validateTestcaseFileContent(fileContent: string): {
  isValid: boolean;
  error?: string;
  testcaseCount?: number;
} {
  if (!fileContent || fileContent.trim() === '') {
    return { isValid: false, error: 'File không được để trống.' };
  }

  // Parse JSON content
  let testcases: any;
  try {
    testcases = JSON.parse(fileContent);
  } catch (error) {
    return {
      isValid: false,
      error: `File JSON không hợp lệ: ${error instanceof Error ? error.message : 'Parse error'}`,
    };
  }

  // Check that the parsed content is an array
  if (!Array.isArray(testcases)) {
    return {
      isValid: false,
      error: 'File JSON phải chứa một mảng (array) các test case.',
    };
  }

  // Check that there is at least one test case
  if (testcases.length === 0) {
    return {
      isValid: false,
      error: 'File phải chứa ít nhất một test case.',
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  for (let i = 0; i < testcases.length; i++) {
    const testcase = testcases[i];
    const index = i + 1;

    // Required fields
    if (!testcase.input && testcase.input !== '') {
      errors.push(`Test case #${index}: Thiếu field 'input' (bắt buộc).`);
    } else if (typeof testcase.input !== 'string') {
      errors.push(`Test case #${index}: Field 'input' phải là string.`);
    }

    if (!testcase.output && testcase.output !== '') {
      errors.push(`Test case #${index}: Thiếu field 'output' (bắt buộc).`);
    } else if (typeof testcase.output !== 'string') {
      errors.push(`Test case #${index}: Field 'output' phải là string.`);
    } else if (testcase.output.trim() === '') {
      warnings.push(`Test case #${index}: Field 'output' là chuỗi rỗng.`);
    }

    // Stop validation if too many errors
    if (errors.length >= 20) {
      errors.push('... và có thể còn nhiều lỗi khác.');
      break;
    }
  }

  // Return results
  if (errors.length > 0) {
    return {
      isValid: false,
      error: `Tìm thấy ${errors.length} lỗi:\n${errors.join('\n')}`,
    };
  }

  if (warnings.length > 0) {
    console.warn('Testcase validation warnings:', warnings);
  }

  return {
    isValid: true,
    testcaseCount: testcases.length,
  };
}
