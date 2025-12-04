import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLexicalTextLength = (jsonString: string): number => {
  if (!jsonString) return 0;
  try {
    const data = JSON.parse(jsonString);
    let textContent = '';

    // Recursive function to walk the JSON tree and find "text"
    const traverse = (node: any) => {
      if (node.text) textContent += node.text;
      if (Array.isArray(node.children)) {
        node.children.forEach(traverse);
      }
    };

    if (data.root) traverse(data.root);
    return textContent.trim().length;
  } catch (e) {
    return 0;
  }
};
