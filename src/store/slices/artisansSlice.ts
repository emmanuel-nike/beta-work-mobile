import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import {
  artisanFromDetail,
  fetchArtisanDetail,
  fetchNearbyArtisans,
  type ArtisanDetail,
} from '../../api/artisans';
import { ApiError } from '../../api/client';
import type { Artisan } from '../../data/artisans';

type DetailStatus = 'loading' | 'succeeded' | 'failed';

type ArtisansState = {
  /** The dashboard "Top artisans near you" rail. */
  nearby: Artisan[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  /** Every artisan we have fetched, by id, so profiles resolve by id. */
  entities: Record<string, Artisan>;
  /** Full public profiles, keyed by artisan id. */
  details: Record<string, ArtisanDetail>;
  detailStatus: Record<string, DetailStatus>;
  detailError: Record<string, string | null>;
};

const initialState: ArtisansState = {
  nearby: [],
  status: 'idle',
  error: null,
  entities: {},
  details: {},
  detailStatus: {},
  detailError: {},
};

function mergeEntities(
  entities: Record<string, Artisan>,
  artisans: Artisan[],
): Record<string, Artisan> {
  const next = { ...entities };
  for (const artisan of artisans) {
    next[artisan.id] = artisan;
  }
  return next;
}

export const loadArtisanDetail = createAsyncThunk<
  ArtisanDetail,
  string,
  { rejectValue: string }
>('artisans/loadDetail', async (id, { rejectWithValue }) => {
  try {
    return await fetchArtisanDetail(id);
  } catch (error) {
    return rejectWithValue(
      error instanceof ApiError
        ? error.message
        : 'Unable to load this artisan.',
    );
  }
});

export const loadNearbyArtisans = createAsyncThunk<
  Artisan[],
  number | undefined,
  { rejectValue: string }
>('artisans/loadNearby', async (limit, { rejectWithValue }) => {
  try {
    return await fetchNearbyArtisans({ limit });
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
    /** Cache a fetched list (e.g. the filtered AllArtisans view) for lookups. */
    cacheArtisans(state, action: PayloadAction<Artisan[]>) {
      return {
        ...state,
        entities: mergeEntities(state.entities, action.payload),
      };
    },
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
        entities: mergeEntities(state.entities, action.payload),
      }))
      .addCase(loadNearbyArtisans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to load artisans near you.';
      })
      .addCase(loadArtisanDetail.pending, (state, action) => ({
        ...state,
        detailStatus: { ...state.detailStatus, [action.meta.arg]: 'loading' },
        detailError: { ...state.detailError, [action.meta.arg]: null },
      }))
      .addCase(loadArtisanDetail.fulfilled, (state, action) => ({
        ...state,
        detailStatus: {
          ...state.detailStatus,
          [action.payload.id]: 'succeeded',
        },
        detailError: { ...state.detailError, [action.payload.id]: null },
        details: { ...state.details, [action.payload.id]: action.payload },
        entities: mergeEntities(state.entities, [
          artisanFromDetail(action.payload),
        ]),
      }))
      .addCase(loadArtisanDetail.rejected, (state, action) => ({
        ...state,
        detailStatus: { ...state.detailStatus, [action.meta.arg]: 'failed' },
        detailError: {
          ...state.detailError,
          [action.meta.arg]: action.payload ?? 'Unable to load this artisan.',
        },
      }));
  },
});

export const { cacheArtisans, clearNearbyArtisans } = artisansSlice.actions;
export const artisansReducer = artisansSlice.reducer;

type ArtisansRoot = { artisans: ArtisansState };

export const selectNearbyArtisans = (state: ArtisansRoot) =>
  state.artisans.nearby;
export const selectNearbyArtisansStatus = (state: ArtisansRoot) =>
  state.artisans.status;
export const selectArtisanById = (state: ArtisansRoot, id: string) =>
  state.artisans.entities[id];
export const selectArtisanDetail = (state: ArtisansRoot, id: string) =>
  state.artisans.details[id];
export const selectArtisanDetailStatus = (state: ArtisansRoot, id: string) =>
  state.artisans.detailStatus[id];
export const selectArtisanDetailError = (state: ArtisansRoot, id: string) =>
  state.artisans.detailError[id];
