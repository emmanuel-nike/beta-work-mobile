import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { acceptJob, declineJob, fetchMyJobs } from '../../api/artisanJobs';
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

export const acceptArtisanJob = createAsyncThunk<
  ArtisanJob,
  string,
  { rejectValue: string }
>('artisanJobs/accept', async (id, { rejectWithValue }) => {
  try {
    return await acceptJob(id);
  } catch (error) {
    return rejectWithValue(
      error instanceof ApiError
        ? error.message
        : 'Unable to accept this booking.',
    );
  }
});

export const declineArtisanJob = createAsyncThunk<
  ArtisanJob,
  string,
  { rejectValue: string }
>('artisanJobs/decline', async (id, { rejectWithValue }) => {
  try {
    return await declineJob(id);
  } catch (error) {
    return rejectWithValue(
      error instanceof ApiError
        ? error.message
        : 'Unable to decline this booking.',
    );
  }
});

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
      })
      .addCase(acceptArtisanJob.fulfilled, (state, action) => ({
        ...state,
        items: replaceJob(state.items, action.payload),
      }))
      .addCase(declineArtisanJob.fulfilled, (state, action) => ({
        ...state,
        items: replaceJob(state.items, action.payload),
      }));
  },
});

export const { clearArtisanJobs } = artisanJobsSlice.actions;
export const artisanJobsReducer = artisanJobsSlice.reducer;

function replaceJob(items: ArtisanJob[], next: ArtisanJob): ArtisanJob[] {
  const exists = items.some(job => job.id === next.id);
  if (!exists) {
    return [next, ...items];
  }
  return items.map(job => (job.id === next.id ? next : job));
}

type ArtisanJobsRoot = { artisanJobs: ArtisanJobsState };

export const selectArtisanJobs = (state: ArtisanJobsRoot) =>
  state.artisanJobs.items;
export const selectArtisanJobsStatus = (state: ArtisanJobsRoot) =>
  state.artisanJobs.status;
export const selectArtisanJobsError = (state: ArtisanJobsRoot) =>
  state.artisanJobs.error;
export const selectArtisanJobById = (state: ArtisanJobsRoot, id: string) =>
  state.artisanJobs.items.find(job => job.id === id);
