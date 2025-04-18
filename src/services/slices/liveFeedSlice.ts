import { TOrdersData } from '@utils-types';
import { RootState } from '../../services/store';
import { getFeedsApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface LiveFeedState {
  data: TOrdersData | null;
  isLoading: boolean;
  fetchError: string | null;
}

const initialState: LiveFeedState = {
  data: null,
  isLoading: false,
  fetchError: null
};

export const fetchLiveFeed = createAsyncThunk(
  'liveFeed/fetchData',
  async () => await getFeedsApi()
);

const liveFeedSlice = createSlice({
  name: 'liveFeed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveFeed.pending, (state) => {
        state.isLoading = true;
        state.fetchError = null;
      })
      .addCase(
        fetchLiveFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchLiveFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.fetchError = action.error.message ?? 'Ошибка при загрузке ленты';
      });
  }
});

// Селекторы
export const selectLiveFeed = (state: RootState) => state.feed.data;
export const selectIsLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.fetchError;
export const selectAllOrders = (state: RootState) =>
  state.feed.data?.orders || [];

export const liveFeedReducer = liveFeedSlice.reducer;
