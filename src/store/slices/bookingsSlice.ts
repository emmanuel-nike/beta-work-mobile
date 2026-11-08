import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  completeBooking,
  createBooking,
  fetchMyBookings,
  updateBooking,
  type CreateBookingInput,
  type UpdateBookingInput,
} from '../../api/bookings';
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

export const submitBooking = createAsyncThunk<
  Booking,
  CreateBookingInput,
  { rejectValue: string }
>('bookings/submit', async (input, { rejectWithValue }) => {
  try {
    return await createBooking(input);
  } catch (error) {
    return rejectWithValue(
      error instanceof ApiError
        ? error.message
        : 'Unable to send your booking request.',
    );
  }
});

export const editBooking = createAsyncThunk<
  Booking,
  { id: string; input: UpdateBookingInput },
  { rejectValue: string }
>('bookings/edit', async ({ id, input }, { rejectWithValue }) => {
  try {
    return await updateBooking(id, input);
  } catch (error) {
    return rejectWithValue(
      error instanceof ApiError
        ? error.message
        : 'Unable to update your booking.',
    );
  }
});

export const completeMyBooking = createAsyncThunk<
  Booking,
  string,
  { rejectValue: string }
>('bookings/complete', async (id, { rejectWithValue }) => {
  try {
    return await completeBooking(id);
  } catch (error) {
    return rejectWithValue(
      error instanceof ApiError
        ? error.message
        : 'Unable to mark this booking as completed.',
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
      })
      // Surface the new booking immediately so "View booking" shows it before
      // the next refresh. Return fresh state: Booking carries readonly fields.
      .addCase(submitBooking.fulfilled, (state, action) => ({
        ...state,
        items: [
          action.payload,
          ...state.items.filter(booking => booking.id !== action.payload.id),
        ],
      }))
      // Replace the edited booking in place so the details screen reflects it.
      .addCase(editBooking.fulfilled, (state, action) => ({
        ...state,
        items: state.items.map(booking =>
          booking.id === action.payload.id ? action.payload : booking,
        ),
      }))
      // Replace the completed booking in place so the details screen reflects it.
      .addCase(completeMyBooking.fulfilled, (state, action) => ({
        ...state,
        items: state.items.map(booking =>
          booking.id === action.payload.id ? action.payload : booking,
        ),
      }));
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
