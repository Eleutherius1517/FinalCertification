import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';

interface Settings {
  email: string;
  notifications: {
    email: boolean;
    telegram: boolean;
    dailyReport: boolean;
  };
  apiKey: string;
  language: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    email: 'user@example.com',
    notifications: {
      email: true,
      telegram: true,
      dailyReport: false,
    },
    apiKey: '********',
    language: 'ru',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'notifications' && typeof settings.notifications === 'object') {
        setSettings({
          ...settings,
          notifications: {
            ...settings.notifications,
            [child]: value,
          },
        });
      }
    } else {
      setSettings({
        ...settings,
        [field]: value,
      });
    }
  };

  const handleSave = () => {
    // Здесь будет логика сохранения настроек
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Настройки
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Настройки успешно сохранены
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Основные настройки */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Основные настройки
            </Typography>
            <TextField
              fullWidth
              label="Email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="API ключ"
              value={settings.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              margin="normal"
              type="password"
            />
            <TextField
              fullWidth
              label="Язык"
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              margin="normal"
              select
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </TextField>
          </Paper>
        </Grid>

        {/* Настройки уведомлений */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Уведомления
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.email}
                  onChange={(e) =>
                    handleChange('notifications.email', e.target.checked)
                  }
                />
              }
              label="Email уведомления"
            />
            <Divider sx={{ my: 1 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.telegram}
                  onChange={(e) =>
                    handleChange('notifications.telegram', e.target.checked)
                  }
                />
              }
              label="Telegram уведомления"
            />
            <Divider sx={{ my: 1 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.dailyReport}
                  onChange={(e) =>
                    handleChange('notifications.dailyReport', e.target.checked)
                  }
                />
              }
              label="Ежедневный отчет"
            />
          </Paper>
        </Grid>

        {/* Кнопки действий */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined">Отмена</Button>
            <Button variant="contained" onClick={handleSave}>
              Сохранить
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings; 