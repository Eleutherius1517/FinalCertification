import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface Channel {
  id: string;
  name: string;
  url: string;
  subscribers: number;
  posts: number;
  engagementRate: number;
}

const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'Tech News',
    url: 'https://t.me/technews',
    subscribers: 50000,
    posts: 150,
    engagementRate: 4.5,
  },
  {
    id: '2',
    name: 'Marketing Tips',
    url: 'https://t.me/marketingtips',
    subscribers: 30000,
    posts: 120,
    engagementRate: 3.8,
  },
];

const Channels: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [newChannel, setNewChannel] = useState({
    name: '',
    url: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewChannel({ name: '', url: '' });
  };

  const handleAddChannel = () => {
    if (newChannel.name && newChannel.url) {
      const channel: Channel = {
        id: Date.now().toString(),
        name: newChannel.name,
        url: newChannel.url,
        subscribers: 0,
        posts: 0,
        engagementRate: 0,
      };
      setChannels([...channels, channel]);
      handleClose();
    }
  };

  const handleDeleteChannel = (id: string) => {
    setChannels(channels.filter(channel => channel.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Управление каналами</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Добавить канал
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>URL</TableCell>
              <TableCell align="right">Подписчики</TableCell>
              <TableCell align="right">Посты</TableCell>
              <TableCell align="right">ER</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {channels.map((channel) => (
              <TableRow key={channel.id}>
                <TableCell>{channel.name}</TableCell>
                <TableCell>{channel.url}</TableCell>
                <TableCell align="right">{channel.subscribers.toLocaleString()}</TableCell>
                <TableCell align="right">{channel.posts}</TableCell>
                <TableCell align="right">{channel.engagementRate}%</TableCell>
                <TableCell align="center">
                  <Tooltip title="Просмотр">
                    <IconButton size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Редактировать">
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteChannel(channel.id)}
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Добавить новый канал</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название канала"
            fullWidth
            value={newChannel.name}
            onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="URL канала"
            fullWidth
            value={newChannel.url}
            onChange={(e) => setNewChannel({ ...newChannel, url: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleAddChannel} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Channels; 