import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GameService } from "../../services/game.service";
import { GameProgress, Chapter } from "../../types/game.types";

interface GameState {
  progress: GameProgress | null;
  chapters: Chapter[];
  loading: boolean;
  error: string | null;
}

const initialState: GameState = {
  progress: null,
  chapters: [],
  loading: false,
  error: null,
};

export const fetchGameProgress = createAsyncThunk(
  "game/fetchProgress",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GameService.getProgress();
      if (response && response.data) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChapters = createAsyncThunk(
  "game/fetchChapters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GameService.getChapters();
      if (response && response.data) {
        return response.data as Chapter[]; // explicit cast to avoid inference issues
      }
      return [] as Chapter[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGameProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })
      .addCase(fetchGameProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchChapters.fulfilled, (state, action) => {
        state.chapters = action.payload;
      });
  },
});

export default gameSlice.reducer;

