import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ContestFormValues } from '@/components/contests/schema';
import { Problem } from '@/types/problems';
import { ContestStatus } from '@/types/contest';

interface CreateContestState extends ContestFormValues {
  selectedProblems: (Problem & { points: number, orderIndex: number })[];
}

const initialState: CreateContestState = {
  title: '',
  description: '',
  startTime: '',
  durationMinutes: 60,
  status: ContestStatus.DRAFT,
  problems: [],
  selectedProblems: [],
};

export const createContestSlice = createSlice({
  name: 'createContest',
  initialState,
  reducers: {
    setContestDraft: (
      state,
      action: PayloadAction<Partial<CreateContestState>>
    ) => {
      return { ...state, ...action.payload };
    },
    clearContestDraft: () => {
      return initialState;
    },
  },
});

export const { setContestDraft, clearContestDraft } = createContestSlice.actions;
export default createContestSlice.reducer;
