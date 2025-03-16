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

export interface UserSettings {
  email: string;
  notifications: {
    email: boolean;
    telegram: boolean;
    dailyReport: boolean;
  };
  apiKey: string;
  language: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
} 