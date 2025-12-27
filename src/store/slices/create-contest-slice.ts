import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ContestFormValues } from '@/components/contests/schema';
import { Problem } from '@/types/problems';

interface CreateContestState extends ContestFormValues {
  selectedProblems: Problem[];
}

const initialState: CreateContestState = {
  name: '',
  description: '',
  startTime: '',
  durationMinutes: 60,
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
