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
    return { isValid: false, error: 'File not found.' };
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
    error: `Invalid file format. Accepted formats: ${AllowedExtensions.join(
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
    return { isValid: false, error: 'File cannot be empty.' };
  }

  // Parse JSON content
  let testcases: any;
  try {
    testcases = JSON.parse(fileContent);
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid JSON file: ${error instanceof Error ? error.message : 'Parse error'}`,
    };
  }

  // Check that the parsed content is an array
  if (!Array.isArray(testcases)) {
    return {
      isValid: false,
      error: 'JSON file must contain an array of test cases.',
    };
  }

  // Check that there is at least one test case
  if (testcases.length === 0) {
    return {
      isValid: false,
      error: 'File must contain at least one test case.',
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  for (let i = 0; i < testcases.length; i++) {
    const testcase = testcases[i];
    const index = i + 1;

    // Required fields
    if (!testcase.input && testcase.input !== '') {
      errors.push(`Test case #${index}: Missing 'input' field (required).`);
    } else if (typeof testcase.input !== 'string') {
      errors.push(`Test case #${index}: Field 'input' must be a string.`);
    }

    if (!testcase.output && testcase.output !== '') {
      errors.push(`Test case #${index}: Missing 'output' field (required).`);
    } else if (typeof testcase.output !== 'string') {
      errors.push(`Test case #${index}: Field 'output' must be a string.`);
    } else if (testcase.output.trim() === '') {
      warnings.push(`Test case #${index}: Field 'output' is an empty string.`);
    }

    // Stop validation if too many errors
    if (errors.length >= 20) {
      errors.push('... and potentially more errors.');
      break;
    }
  }

  // Return results
  if (errors.length > 0) {
    return {
      isValid: false,
      error: `Found ${errors.length} errors:\n${errors.join('\n')}`,
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
