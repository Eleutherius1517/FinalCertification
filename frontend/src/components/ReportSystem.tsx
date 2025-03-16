import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';

interface Report {
  id: string;
  name: string;
  type: 'PDF' | 'CSV' | 'EXCEL';
  schedule: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'NONE';
  lastGenerated: Date;
  nextGeneration: Date;
  status: 'ACTIVE' | 'PAUSED';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  metrics: string[];
}

export const ReportSystem: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  const reportTemplates: ReportTemplate[] = [
    {
      id: '1',
      name: 'Общий отчет по каналам',
      description: 'Общая статистика по всем отслеживаемым каналам',
      metrics: ['Подписчики', 'Охват', 'Вовлеченность', 'Топ постов'],
    },
    {
      id: '2',
      name: 'Анализ конкурентов',
      description: 'Сравнительный анализ с конкурентами',
      metrics: ['Доля рынка', 'Темпы роста', 'Контент-стратегия'],
    },
    {
      id: '3',
      name: 'Отчет по упоминаниям',
      description: 'Анализ упоминаний бренда и ключевых слов',
      metrics: ['Упоминания', 'Тональность', 'Источники'],
    },
  ];

  const handleGenerateReport = async () => {
    // TODO: Implement report generation logic
  };

  const handleScheduleReport = (reportId: string) => {
    // TODO: Implement report scheduling logic
  };

  const handleDeleteReport = (reportId: string) => {
    // TODO: Implement report deletion logic
  };

  const handleEditReport = (reportId: string) => {
    // TODO: Implement report editing logic
  };

  const handleDownloadReport = (reportId: string) => {
    // TODO: Implement report download logic
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Создание нового отчета
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Шаблон отчета</InputLabel>
                <Select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  label="Шаблон отчета"
                >
                  {reportTemplates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
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
            </Grid>

            <Grid item xs={12} md={4}>
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
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleGenerateReport}
                disabled={!selectedTemplate || !startDate || !endDate}
              >
                Сгенерировать отчет
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Запланированные отчеты
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>Расписание</TableCell>
                  <TableCell>Последняя генерация</TableCell>
                  <TableCell>Следующая генерация</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.schedule}</TableCell>
                    <TableCell>
                      {report.lastGenerated.toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      {report.nextGeneration.toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        color={report.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Скачать">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Настроить расписание">
                        <IconButton
                          size="small"
                          onClick={() => handleScheduleReport(report.id)}
                        >
                          <ScheduleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Редактировать">
                        <IconButton
                          size="small"
                          onClick={() => handleEditReport(report.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteReport(report.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}; 