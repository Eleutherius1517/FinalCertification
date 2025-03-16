import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('7');

  const engagementData = {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    datasets: [
      {
        label: 'Engagement Rate',
        data: [4.2, 4.5, 4.1, 4.8, 4.3, 4.6, 4.4],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const postTypesData = {
    labels: ['Текст', 'Фото', 'Видео', 'Опросы', 'Другое'],
    datasets: [
      {
        data: [40, 25, 20, 10, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Динамика Engagement Rate',
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Типы контента',
      },
    },
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Аналитика</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Период</InputLabel>
          <Select
            value={timeRange}
            label="Период"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7">7 дней</MenuItem>
            <MenuItem value="30">30 дней</MenuItem>
            <MenuItem value="90">90 дней</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Ключевые метрики */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Средний ER
              </Typography>
              <Typography variant="h5">4.4%</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Активность
              </Typography>
              <Typography variant="h5">+12%</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Прирост подписчиков
              </Typography>
              <Typography variant="h5">+1.2K</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Постов в день
              </Typography>
              <Typography variant="h5">8.5</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Графики */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Bar options={options} data={engagementData} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Pie options={pieOptions} data={postTypesData} />
          </Paper>
        </Grid>

        {/* Дополнительная аналитика */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Топ-5 постов по вовлеченности
            </Typography>
            <Box sx={{ mt: 2 }}>
              {/* Здесь будет таблица с топ постами */}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 