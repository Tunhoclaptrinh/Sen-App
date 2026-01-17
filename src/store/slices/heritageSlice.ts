import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HeritageService } from "../../services/heritage.service";
import { HeritageSite, Artifact } from "../../types/heritage.types";

interface HeritageState {
  items: HeritageSite[];
  currentItem: HeritageSite | null;
  loading: boolean;
  error: string | null;
  artifacts: Artifact[];
}

const initialState: HeritageState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  artifacts: [],
};

export const fetchHeritageSites = createAsyncThunk(
  "heritage/fetchAll",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await HeritageService.getAll(params);
      if (response && response.data) {
          return (response.data as unknown) as HeritageSite[];
      }
      return [] as HeritageSite[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHeritageDetail = createAsyncThunk(
  "heritage/fetchDetail",
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await HeritageService.getOne(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const heritageSlice = createSlice({
  name: "heritage",
  initialState,
  reducers: {
    clearCurrentItem: (state) => {
      state.currentItem = null;
      state.artifacts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeritageSites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHeritageSites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchHeritageSites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchHeritageDetail.fulfilled, (state, action) => {
        state.currentItem = action.payload;
      });
  },
});

export const { clearCurrentItem } = heritageSlice.actions;
export default heritageSlice.reducer;
