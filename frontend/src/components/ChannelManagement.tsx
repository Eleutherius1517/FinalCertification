import React, { useState } from 'react';
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Channel {
  id: string;
  name: string;
  url: string;
  platform: 'TELEGRAM' | 'TWITTER';
  subscribers: number;
  lastUpdate: Date;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
}

export const ChannelManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleRefresh = async (channelId: string) => {
    setLoading(true);
    try {
      // TODO: Implement refresh logic
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (channelId: string) => {
    // TODO: Implement delete logic
  };

  const handleEdit = (channelId: string) => {
    // TODO: Implement edit logic
  };

  const getStatusColor = (status: Channel['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PAUSED':
        return 'warning';
      case 'ERROR':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск каналов по названию или URL"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      <Grid container spacing={2}>
        {filteredChannels.map((channel) => (
          <Grid item xs={12} sm={6} md={4} key={channel.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" component="div">
                      {channel.name}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {channel.url}
                    </Typography>
                  </Box>
                  <Chip
                    label={channel.status}
                    color={getStatusColor(channel.status)}
                    size="small"
                  />
                </Box>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Подписчиков: {channel.subscribers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Обновлено {formatDistanceToNow(channel.lastUpdate, { locale: ru, addSuffix: true })}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Tooltip title="Обновить данные">
                    <IconButton
                      size="small"
                      onClick={() => handleRefresh(channel.id)}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Редактировать">
                    <IconButton size="small" onClick={() => handleEdit(channel.id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton size="small" onClick={() => handleDelete(channel.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 