import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TagsService } from '@/services/tags-service';
import { TopicsService } from '@/services/topics-service';
import type { Tag } from '@/types/tags';
import type { Topic } from '@/types/topics';

interface MetadataState {
  tags: Tag[];
  topics: Topic[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetched: number | null;
}

const initialState: MetadataState = {
  tags: [],
  topics: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

export const fetchTags = createAsyncThunk('metadata/fetchTags', async () => {
  const response = await TagsService.getAllTags({ limit: 1000 }); // Fetch all tags
  return response.data.data.data;
});

export const fetchTopics = createAsyncThunk('metadata/fetchTopics', async () => {
  const response = await TopicsService.getAllTopics({ limit: 1000 }); // Fetch all topics
  return response.data.data.data;
});

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Tags
      .addCase(fetchTags.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tags';
      })
      // Topics
      .addCase(fetchTopics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topics = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch topics';
      });
  },
});

export default metadataSlice.reducer;
