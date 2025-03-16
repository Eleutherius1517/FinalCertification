import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Channel {
  id: string;
  name: string;
  url: string;
  subscribers: number;
  posts: number;
  engagementRate: number;
  status: 'active' | 'inactive';
  lastUpdate: string;
}

interface ChannelsState {
  items: Channel[];
  loading: boolean;
  error: string | null;
}

const initialState: ChannelsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchChannels = createAsyncThunk<Channel[]>(
  'channels/fetchChannels',
  async () => {
    const response = await axios.get<Channel[]>('/api/channels');
    return response.data;
  }
);

export const addChannel = createAsyncThunk<Channel, Omit<Channel, 'id' | 'subscribers' | 'posts' | 'engagementRate' | 'lastUpdate'>>(
  'channels/addChannel',
  async (channel) => {
    const response = await axios.post<Channel>('/api/channels', channel);
    return response.data;
  }
);

export const deleteChannel = createAsyncThunk<string, string>(
  'channels/deleteChannel',
  async (id) => {
    await axios.delete(`/api/channels/${id}`);
    return id;
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки каналов';
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.items = state.items.filter(channel => channel.id !== action.payload);
      });
  },
});

export default channelsSlice.reducer; 