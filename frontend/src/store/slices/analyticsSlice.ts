import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface AnalyticsData {
  engagementRate: number;
  activity: number;
  subscriberGrowth: number;
  postsPerDay: number;
  postTypes: {
    text: number;
    photo: number;
    video: number;
    polls: number;
    other: number;
  };
  topPosts: Array<{
    id: string;
    title: string;
    engagementRate: number;
    views: number;
    date: string;
  }>;
}

interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  timeRange: '7' | '30' | '90';
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
  timeRange: '7',
};

export const fetchAnalytics = createAsyncThunk<AnalyticsData, string>(
  'analytics/fetchAnalytics',
  async (timeRange) => {
    const response = await axios.get<AnalyticsData>(`/api/analytics?timeRange=${timeRange}`);
    return response.data;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setTimeRange: (state, action) => {
      state.timeRange = action.payload as '7' | '30' | '90';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки аналитики';
      });
  },
});

export const { setTimeRange } = analyticsSlice.actions;
export default analyticsSlice.reducer; 