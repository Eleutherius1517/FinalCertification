import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Post {
  id: string;
  title: string;
  platform: 'TELEGRAM' | 'TWITTER';
  engagementRate: number;
  views: number;
  date: Date;
  url: string;
}

interface SortConfig {
  key: keyof Post;
  direction: 'asc' | 'desc';
}

export const TrendingPostsTable: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [platform, setPlatform] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSort = (key: keyof Post) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const filteredPosts = sortedPosts.filter(post => {
    const matchesPlatform = platform === 'all' || post.platform === platform;
    const matchesDateRange = (!startDate || post.date >= startDate) && 
                           (!endDate || post.date <= endDate);
    return matchesPlatform && matchesDateRange;
  });

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Платформа</InputLabel>
          <Select
            value={platform}
            label="Платформа"
            onChange={(e) => setPlatform(e.target.value)}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="TELEGRAM">Telegram</MenuItem>
            <MenuItem value="TWITTER">Twitter</MenuItem>
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Начальная дата"
            value={startDate}
            onChange={setStartDate}
            slots={{
              textField: (params) => <TextField {...params} fullWidth />
            }}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Конечная дата"
            value={endDate}
            onChange={setEndDate}
            slots={{
              textField: (params) => <TextField {...params} fullWidth />
            }}
          />
        </LocalizationProvider>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                     onClick={() => handleSort('title')}>
                  Заголовок
                  {sortConfig.key === 'title' && (
                    <IconButton size="small">
                      {sortConfig.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
                    </IconButton>
                  )}
                </Box>
              </TableCell>
              <TableCell>Платформа</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                     onClick={() => handleSort('engagementRate')}>
                  ER
                  {sortConfig.key === 'engagementRate' && (
                    <IconButton size="small">
                      {sortConfig.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
                    </IconButton>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                     onClick={() => handleSort('views')}>
                  Просмотры
                  {sortConfig.key === 'views' && (
                    <IconButton size="small">
                      {sortConfig.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
                    </IconButton>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                     onClick={() => handleSort('date')}>
                  Дата
                  {sortConfig.key === 'date' && (
                    <IconButton size="small">
                      {sortConfig.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
                    </IconButton>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.platform}</TableCell>
                <TableCell>{post.engagementRate.toFixed(2)}%</TableCell>
                <TableCell>{post.views.toLocaleString()}</TableCell>
                <TableCell>{format(post.date, 'dd.MM.yyyy HH:mm', { locale: ru })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 