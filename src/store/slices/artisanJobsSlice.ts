import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchMyJobs } from '../../api/artisanJobs';
import { ApiError } from '../../api/client';
import type { ArtisanJob } from '../../data/artisanJobs';

type ArtisanJobsState = {
  items: ArtisanJob[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: ArtisanJobsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const loadMyJobs = createAsyncThunk<
  ArtisanJob[],
  void,
  { rejectValue: string }
>('artisanJobs/loadMine', async (_, { rejectWithValue }) => {
  try {
    return await fetchMyJobs();
  } catch (error) {
    return rejectWithValue(
      error instanceof ApiError ? error.message : 'Unable to load your jobs.',
    );
  }
});

const artisanJobsSlice = createSlice({
  name: 'artisanJobs',
  initialState,
  reducers: {
    clearArtisanJobs() {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadMyJobs.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      // Return fresh state: ArtisanJob carries readonly fields that Immer
      // cannot host in a mutable draft.
      .addCase(loadMyJobs.fulfilled, (state, action) => ({
        ...state,
        status: 'succeeded',
        error: null,
        items: action.payload,
      }))
      .addCase(loadMyJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to load your jobs.';
      });
  },
});

export const { clearArtisanJobs } = artisanJobsSlice.actions;
export const artisanJobsReducer = artisanJobsSlice.reducer;

type ArtisanJobsRoot = { artisanJobs: ArtisanJobsState };

export const selectArtisanJobs = (state: ArtisanJobsRoot) =>
  state.artisanJobs.items;
export const selectArtisanJobsStatus = (state: ArtisanJobsRoot) =>
  state.artisanJobs.status;
export const selectArtisanJobsError = (state: ArtisanJobsRoot) =>
  state.artisanJobs.error;
export const selectArtisanJobById = (state: ArtisanJobsRoot, id: string) =>
  state.artisanJobs.items.find(job => job.id === id);
