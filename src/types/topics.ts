export interface Topic {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Temporary constants - will be replaced by dynamic data from backend
export const TOPIC_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'algorithms', label: 'Thuật toán' },
  { value: 'data-structures', label: 'Cấu trúc dữ liệu' },
  { value: 'math', label: 'Toán học' },
];
