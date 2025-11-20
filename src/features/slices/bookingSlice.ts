import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { addDays } from 'date-fns';
import type { RootState } from '../../app/store';

interface BookingState {
  stayDays: number;
  checkInDate: string;
  checkOutDate: string;
}

const initialCheckIn = new Date();
const initialState: BookingState = {
  stayDays: 2,
  checkInDate: initialCheckIn.toISOString(),
  checkOutDate: addDays(initialCheckIn, 2).toISOString(),
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    incrementDays: (state) => {
      state.stayDays += 1;
    },
    decrementDays: (state) => {
      if (state.stayDays > 1) state.stayDays -= 1;
    },
    setStayDates: (state, action: PayloadAction<{ checkInDate: string; checkOutDate: string }>) => {
      state.checkInDate = action.payload.checkInDate;
      state.checkOutDate = action.payload.checkOutDate;
    },
  },
});

export const { incrementDays, decrementDays, setStayDates } = bookingSlice.actions;
export const selectBooking = (state: RootState) => state.booking;
export default bookingSlice.reducer;
