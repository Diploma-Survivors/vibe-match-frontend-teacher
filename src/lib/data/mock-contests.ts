import { type Contest, ContestStatus } from '@/types/contest';
import {
  type ProblemData,
  ProblemDifficulty,
  ProblemType,
} from '@/types/problems';

const mockProblem: ProblemData = {
  id: 1,
  title: 'Two Sum',
  description: `
      <p>Cho một mảng các số nguyên <code>nums</code> và một số nguyên <code>target</code>, hãy trả về các chỉ số của hai số sao cho tổng của chúng bằng <code>target</code>.</p>
      
      <p>Bạn có thể giả định rằng mỗi đầu vào sẽ có chính xác một lời giải, và bạn không thể sử dụng cùng một phần tử hai lần.</p>
      
      <p>Bạn có thể trả về câu trả lời theo bất kỳ thứ tự nào.</p>
      
      <h3>Ví dụ 1:</h3>
      <pre>
      Input: nums = [2,7,11,15], target = 9
      Output: [0,1]
      Giải thích: Vì nums[0] + nums[1] == 9, chúng ta trả về [0, 1].
      </pre>
      
      <h3>Ví dụ 2:</h3>
      <pre>
      Input: nums = [3,2,4], target = 6
      Output: [1,2]
      </pre>
    `,
  inputDescription: `
      <p>Dòng đầu tiên chứa hai số nguyên <code>n</code> và <code>target</code> (1 ≤ n ≤ 10^4, -10^9 ≤ target ≤ 10^9)</p>
      <p>Dòng thứ hai chứa <code>n</code> số nguyên <code>nums[i]</code> (-10^9 ≤ nums[i] ≤ 10^9)</p>
    `,
  outputDescription: `
      <p>In ra hai số nguyên là chỉ số của hai phần tử có tổng bằng target, cách nhau bởi dấu cách.</p>
    `,
  maxScore: 100,
  timeLimitMs: 1000,
  memoryLimitKb: 256000,
  difficulty: ProblemDifficulty.EASY,
  type: ProblemType.STANDALONE,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T14:45:00Z',
  tags: [1, 3, 5], // Array manipulation, Hash table, Two pointers
  topic: 1, // Data Structures
  testcase: 1,
  testcaseSamples: [
    {
      input: '4 9\n2 7 11 15',
      output: '0 1',
    },
    {
      input: '3 6\n3 2 4',
      output: '1 2',
    },
  ],
};

export const mockContests: Contest[] = [
  {
    id: 1,
    name: 'Vibe Match Programming Contest #1',
    description:
      'Cuộc thi lập trình dành cho sinh viên năm nhất, tập trung vào các thuật toán cơ bản và cấu trúc dữ liệu.',
    startTime: '2025-08-25T09:00:00',
    endTime: '2025-08-25T12:00:00',
    durationMinutes: 180,
    status: ContestStatus.PUBLIC,
    problems: [mockProblem],
    createdBy: 'Nguyễn Văn A',
    createdAt: '2025-08-15T10:30:00',
  },
  {
    id: 2,
    name: 'Advanced Algorithms Challenge',
    description:
      'Cuộc thi dành cho các lập trình viên có kinh nghiệm, bao gồm các bài toán về đồ thị và quy hoạch động.',
    startTime: '2025-08-20T14:00:00',
    endTime: '2025-08-20T18:00:00',
    durationMinutes: 240,
    status: ContestStatus.PRIVATE,
    problems: [mockProblem],
    createdBy: 'Trần Thị B',
    createdAt: '2025-08-10T16:45:00',
  },
  {
    id: 3,
    name: 'Data Structure Mastery',
    description:
      'Kiểm tra kiến thức về cấu trúc dữ liệu: mảng, danh sách liên kết, ngăn xếp, hàng đợi.',
    startTime: '2025-08-15T08:00:00',
    endTime: '2025-08-15T11:30:00',
    durationMinutes: 210,
    status: ContestStatus.PUBLIC,
    problems: [mockProblem],
    createdBy: 'Lê Văn C',
    createdAt: '2025-08-05T09:15:00',
  },
];
