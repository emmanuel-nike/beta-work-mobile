import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchMyBookings } from '../../api/bookings';
import { ApiError } from '../../api/client';
import type { Booking } from '../../data/bookings';

type BookingsState = {
  items: Booking[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: BookingsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const loadMyBookings = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>('bookings/loadMine', async (_, { rejectWithValue }) => {
  try {
    return await fetchMyBookings();
  } catch (error) {
    return rejectWithValue(
      error instanceof ApiError
        ? error.message
        : 'Unable to load your bookings.',
    );
  }
});

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearBookings() {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadMyBookings.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      // Return fresh state: Booking carries readonly fields that Immer cannot
      // host in a mutable draft.
      .addCase(loadMyBookings.fulfilled, (state, action) => ({
        ...state,
        status: 'succeeded',
        error: null,
        items: action.payload,
      }))
      .addCase(loadMyBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to load your bookings.';
      });
  },
});

export const { clearBookings } = bookingsSlice.actions;
export const bookingsReducer = bookingsSlice.reducer;

type BookingsRoot = { bookings: BookingsState };

export const selectBookings = (state: BookingsRoot) => state.bookings.items;
export const selectBookingsStatus = (state: BookingsRoot) =>
  state.bookings.status;
export const selectBookingsError = (state: BookingsRoot) => state.bookings.error;
export const selectBookingById = (state: BookingsRoot, id: string) =>
  state.bookings.items.find(booking => booking.id === id);
