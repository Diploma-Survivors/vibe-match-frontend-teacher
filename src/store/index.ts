import { configureStore } from '@reduxjs/toolkit';
import aiReviewReducer from './slides/ai-review-slice';

export const store = configureStore({
  reducer: {
    aiReview: aiReviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
