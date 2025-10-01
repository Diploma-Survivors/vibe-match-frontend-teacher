export interface Contest {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: "chưa bắt đầu" | "đang diễn ra" | "đã kết thúc";
  accessRange: "public" | "private";
  problems: string[]; // array of problem IDs
  participants: number; // Changed from participantCount to participants
  maxParticipants?: number;
  createdBy: string;
  createdAt: string;
}

export interface ContestFilters {
  id?: string;
  name?: string;
  status?: string;
  accessRange?: string;
}

export const CONTEST_STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "chưa bắt đầu", label: "Chưa bắt đầu" },
  { value: "đang diễn ra", label: "Đang diễn ra" },
  { value: "đã kết thúc", label: "Đã kết thúc" },
];

export const CONTEST_ACCESS_RANGE_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "public", label: "Công khai" },
  { value: "private", label: "Riêng tư" },
];
