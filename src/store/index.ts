import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import aiReviewReducer from './slices/ai-review-slice';
import createProblemReducer from './slices/create-problem-slice';
import metadataReducer from './slices/metadata-slice';

const persistConfig = {
  key: 'createProblem',
  storage,
  blacklist: ['testcaseFile'], // Exclude non-serializable file
};

const persistedCreateProblemReducer = persistReducer(
  persistConfig,
  createProblemReducer
);

const metadataPersistConfig = {
  key: 'metadata',
  storage,
};

const persistedMetadataReducer = persistReducer(
  metadataPersistConfig,
  metadataReducer
);

export const store = configureStore({
  reducer: {
    aiReview: aiReviewReducer,
    createProblem: persistedCreateProblemReducer,
    metadata: persistedMetadataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
