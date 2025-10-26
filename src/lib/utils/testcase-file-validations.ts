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
    return { isValid: false };
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
} {
  // Trim whitespace from the start and end of the file
  const lines = fileContent.trim().split('\n');

  // Check 1: Ensure the file is not empty
  if (lines.length === 0 || (lines.length === 1 && lines[0].trim() === '')) {
    return { isValid: false, error: 'File không được để trống.' };
  }

  // Check 2: Validate the test case count
  const testcaseCount = Number.parseInt(lines[0], 10);
  if (Number.isNaN(testcaseCount) || testcaseCount <= 0) {
    return {
      isValid: false,
      error: 'Dòng đầu tiên phải là một số hợp lệ thể hiện số lượng test case.',
    };
  }

  // Check 3: Verify the total number of lines
  const expectedLineCount = 1 + testcaseCount * 3;
  if (lines.length !== expectedLineCount) {
    return {
      isValid: false,
      error: `Số dòng không chính xác. Mong đợi ${expectedLineCount} dòng cho ${testcaseCount} test case, nhưng tìm thấy ${lines.length} dòng.`,
    };
  }

  // Check 4: Validate each test case block
  for (let i = 0; i < testcaseCount; i++) {
    const baseIndex = 1 + i * 3;
    const name = lines[baseIndex]?.trim();
    const input = lines[baseIndex + 1]?.trim();
    const output = lines[baseIndex + 2]?.trim();

    if (!name) {
      return {
        isValid: false,
        error: `Test case #${i + 1} bị thiếu tên.`,
      };
    }
    if (!input) {
      return {
        isValid: false,
        error: `Test case '${name}' (Test #${i + 1}) bị thiếu dòng input.`,
      };
    }
    if (!output) {
      return {
        isValid: false,
        error: `Test case '${name}' (Test #${i + 1}) bị thiếu dòng output.`,
      };
    }
  }

  // If all checks pass
  return { isValid: true };
}
