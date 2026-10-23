import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchNearbyArtisans } from '../../api/artisans';
import { ApiError } from '../../api/client';
import type { Artisan } from '../../data/artisans';

type ArtisansState = {
  nearby: Artisan[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: ArtisansState = {
  nearby: [],
  status: 'idle',
  error: null,
};

export const loadNearbyArtisans = createAsyncThunk<
  Artisan[],
  number | undefined,
  { rejectValue: string }
>('artisans/loadNearby', async (limit, { rejectWithValue }) => {
  try {
    return await fetchNearbyArtisans(limit);
  } catch (error) {
    return rejectWithValue(
      error instanceof ApiError
        ? error.message
        : 'Unable to load artisans near you.',
    );
  }
});

const artisansSlice = createSlice({
  name: 'artisans',
  initialState,
  reducers: {
    clearNearbyArtisans() {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadNearbyArtisans.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      // Return fresh state: Artisan is a readonly type Immer cannot host in a
      // mutable draft.
      .addCase(loadNearbyArtisans.fulfilled, (state, action) => ({
        ...state,
        status: 'succeeded',
        error: null,
        nearby: action.payload,
      }))
      .addCase(loadNearbyArtisans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to load artisans near you.';
      });
  },
});

export const { clearNearbyArtisans } = artisansSlice.actions;
export const artisansReducer = artisansSlice.reducer;

type ArtisansRoot = { artisans: ArtisansState };

export const selectNearbyArtisans = (state: ArtisansRoot) =>
  state.artisans.nearby;
export const selectNearbyArtisansStatus = (state: ArtisansRoot) =>
  state.artisans.status;
export const selectNearbyArtisanById = (state: ArtisansRoot, id: string) =>
  state.artisans.nearby.find(artisan => artisan.id === id);
