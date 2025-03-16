import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Активность каналов',
    },
  },
};

const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const data = {
  labels,
  datasets: [
    {
      label: 'Просмотры',
      data: [1200, 1900, 1500, 2100, 1800, 2500, 2200],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
    {
      label: 'Реакции',
      data: [100, 150, 120, 180, 140, 200, 170],
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1,
    },
  ],
};

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Дашборд
      </Typography>
      
      <Grid container spacing={3}>
        {/* Статистика */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Всего каналов
              </Typography>
              <Typography variant="h5">12</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Общая аудитория
              </Typography>
              <Typography variant="h5">1.2M</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Средний ER
              </Typography>
              <Typography variant="h5">4.2%</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Постов сегодня
              </Typography>
              <Typography variant="h5">45</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* График активности */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Line options={options} data={data} />
          </Paper>
        </Grid>

        {/* Топ постов */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Топ постов
            </Typography>
            <Box sx={{ mt: 2 }}>
              {/* Здесь будет список топ постов */}
            </Box>
          </Paper>
        </Grid>

        {/* Активность по часам */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Активность по часам
            </Typography>
            <Box sx={{ mt: 2 }}>
              {/* Здесь будет график активности по часам */}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 