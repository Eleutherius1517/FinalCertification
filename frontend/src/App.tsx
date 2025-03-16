import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import { TrendingPostsTable } from './components/TrendingPostsTable';
import { ChannelManagement } from './components/ChannelManagement';
import { UserProfileSettings } from './components/UserProfileSettings';
import { ReportSystem } from './components/ReportSystem';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route path="/trending" element={<TrendingPostsTable />} />
              <Route path="/channels" element={<ChannelManagement />} />
              <Route path="/profile" element={<UserProfileSettings />} />
              <Route path="/reports" element={<ReportSystem />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 