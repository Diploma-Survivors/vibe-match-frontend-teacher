import { type ProblemData, ProblemDifficulty } from '../../types/problems';

// Mock problem data
export const mockProblems: ProblemData[] = [
  {
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
    type: 'standalone',
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
  },
  {
    id: 2,
    title: 'Binary Tree Maximum Path Sum',
    description: `
      <p>Một <strong>đường đi</strong> trong cây nhị phân là một chuỗi các nút trong đó mỗi cặp nút liền kề trong chuỗi có một cạnh nối chúng. Một nút có thể xuất hiện trong chuỗi <strong>nhiều nhất một lần</strong>. Lưu ý rằng đường đi không cần đi qua gốc.</p>
      
      <p><strong>Tổng đường đi</strong> của một đường đi là tổng giá trị của các nút trong đường đi.</p>
      
      <p>Cho gốc của một cây nhị phân, hãy trả về <strong>tổng đường đi tối đa</strong> của bất kỳ đường đi không rỗng nào.</p>
      
      <h3>Ví dụ 1:</h3>
      <pre>
      Input: root = [1,2,3]
      Output: 6
      Giải thích: Đường đi tối ưu là 2 -> 1 -> 3 với tổng đường đi là 2 + 1 + 3 = 6.
      </pre>
      
      <h3>Ví dụ 2:</h3>
      <pre>
      Input: root = [-10,9,20,null,null,15,7]
      Output: 42
      Giải thích: Đường đi tối ưu là 15 -> 20 -> 7 với tổng đường đi là 15 + 20 + 7 = 42.
      </pre>
    `,
    inputDescription: `
      <p>Dòng đầu tiên chứa số nguyên <code>n</code> là số nút của cây (1 ≤ n ≤ 3 * 10^4)</p>
      <p>Dòng thứ hai chứa <code>n</code> số nguyên mô tả các nút của cây theo thứ tự level-order, sử dụng "null" cho nút rỗng (-1000 ≤ Node.val ≤ 1000)</p>
    `,
    outputDescription: `
      <p>In ra một số nguyên là tổng đường đi tối đa.</p>
    `,
    maxScore: 250,
    timeLimitMs: 2000,
    memoryLimitKb: 512000,
    difficulty: ProblemDifficulty.HARD,
    type: 'contest',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-05T16:20:00Z',
    tags: [2, 4, 6], // Tree, DFS, Dynamic Programming
    topic: 2, // Trees
    testcase: 2,
    testcaseSamples: [
      {
        input: '3\n1 2 3',
        output: '6',
      },
      {
        input: '7\n-10 9 20 null null 15 7',
        output: '42',
      },
    ],
  },
  {
    id: 3,
    title: 'Valid Parentheses',
    description: `
      <p>Cho một chuỗi <code>s</code> chỉ chứa các ký tự <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> và <code>']'</code>, hãy xác định xem chuỗi đầu vào có hợp lệ hay không.</p>
      
      <p>Một chuỗi đầu vào hợp lệ khi:</p>
      <ol>
        <li>Các dấu ngoặc mở phải được đóng bởi cùng loại dấu ngoặc.</li>
        <li>Các dấu ngoặc mở phải được đóng theo đúng thứ tự.</li>
        <li>Mỗi dấu ngoặc đóng có một dấu ngoặc mở tương ứng cùng loại.</li>
      </ol>
      
      <h3>Ví dụ 1:</h3>
      <pre>
      Input: s = "()"
      Output: true
      </pre>
      
      <h3>Ví dụ 2:</h3>
      <pre>
      Input: s = "()[]{}"
      Output: true
      </pre>
      
      <h3>Ví dụ 3:</h3>
      <pre>
      Input: s = "(]"
      Output: false
      </pre>
    `,
    inputDescription: `
      <p>Một dòng duy nhất chứa chuỗi <code>s</code> (1 ≤ |s| ≤ 10^4)</p>
      <p>Chuỗi chỉ chứa các ký tự: '(', ')', '{', '}', '[', ']'</p>
    `,
    outputDescription: `
      <p>In ra "true" nếu chuỗi hợp lệ, ngược lại in ra "false".</p>
    `,
    maxScore: 150,
    timeLimitMs: 1500,
    memoryLimitKb: 128000,
    difficulty: ProblemDifficulty.MEDIUM,
    type: 'hybrid',
    createdAt: '2024-01-25T11:45:00Z',
    updatedAt: '2024-01-30T13:10:00Z',
    tags: [7, 8], // Stack, String
    topic: 3, // Algorithms
    testcase: 3,
    testcaseSamples: [
      {
        input: '()',
        output: 'true',
      },
      {
        input: '()[]{}',
        output: 'true',
      },
      {
        input: '(]',
        output: 'false',
      },
    ],
  },
];
