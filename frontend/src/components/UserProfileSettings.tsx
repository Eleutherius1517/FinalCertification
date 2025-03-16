import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  TextField,
  Button,
  Divider,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import { Save as SaveIcon, Check as CheckIcon } from '@mui/icons-material';

interface NotificationPreferences {
  email: boolean;
  telegram: boolean;
  sms: boolean;
  frequency: 'REALTIME' | 'DAILY' | 'WEEKLY';
  keywords: string[];
}

interface SubscriptionTier {
  name: 'FREE' | 'PRO' | 'ENTERPRISE';
  features: string[];
  price: number;
}

export const UserProfileSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    telegram: true,
    sms: false,
    frequency: 'DAILY',
    keywords: [],
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [saved, setSaved] = useState(false);

  const subscriptionTiers: SubscriptionTier[] = [
    {
      name: 'FREE',
      features: [
        'Базовые уведомления',
        'До 5 отслеживаемых каналов',
        'Ежедневные отчеты',
      ],
      price: 0,
    },
    {
      name: 'PRO',
      features: [
        'Все функции Free',
        'Расширенные уведомления',
        'До 20 отслеживаемых каналов',
        'Еженедельные отчеты',
        'API доступ',
      ],
      price: 29,
    },
    {
      name: 'ENTERPRISE',
      features: [
        'Все функции Pro',
        'Неограниченное количество каналов',
        'Приоритетная поддержка',
        'Интеграция с CRM',
        'Доступ к API',
        'Выделенный менеджер',
      ],
      price: 99,
    },
  ];

  const handlePreferenceChange = (field: keyof NotificationPreferences) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPreferences(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    }));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setPreferences(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setPreferences(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword),
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Implement save logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Настройки уведомлений
          </Typography>
          
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Каналы уведомлений
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.email}
                  onChange={handlePreferenceChange('email')}
                />
              }
              label="Email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.telegram}
                  onChange={handlePreferenceChange('telegram')}
                />
              }
              label="Telegram"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.sms}
                  onChange={handlePreferenceChange('sms')}
                />
              }
              label="SMS"
            />
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <FormControl component="fieldset">
            <Typography variant="subtitle1" gutterBottom>
              Частота уведомлений
            </Typography>
            <RadioGroup
              value={preferences.frequency}
              onChange={handlePreferenceChange('frequency')}
            >
              <FormControlLabel
                value="REALTIME"
                control={<Radio />}
                label="В реальном времени"
              />
              <FormControlLabel
                value="DAILY"
                control={<Radio />}
                label="Ежедневно"
              />
              <FormControlLabel
                value="WEEKLY"
                control={<Radio />}
                label="Еженедельно"
              />
            </RadioGroup>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Ключевые слова для отслеживания
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Добавить ключевое слово"
                fullWidth
              />
              <Button variant="contained" onClick={handleAddKeyword}>
                Добавить
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {preferences.keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleRemoveKeyword(keyword)}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Сохранить настройки
            </Button>
          </Box>

          {saved && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Настройки успешно сохранены
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Тарифные планы
          </Typography>
          
          <Grid container spacing={2}>
            {subscriptionTiers.map((tier) => (
              <Grid item xs={12} md={4} key={tier.name}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {tier.name}
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {tier.price === 0 ? 'Бесплатно' : `$${tier.price}/мес`}
                    </Typography>
                    <List>
                      {tier.features.map((feature) => (
                        <ListItem key={feature}>
                          <ListItemIcon>
                            <CheckIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      {tier.name === 'FREE' ? 'Текущий план' : 'Перейти на план'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}; 