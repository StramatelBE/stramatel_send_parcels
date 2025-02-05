import LoginIcon from '@mui/icons-material/Login';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import useAuthStore from '../../../stores/authStore';
import UserService from '../api/userService';
import { useTranslation } from 'react-i18next';

function LoginComponents() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken } = useAuthStore();
  async function handleSubmit(e) {
    if (e) e.preventDefault();
    const username = 'user';
    try {
      const user = await UserService.login(username, password);

      if (user) {
        setToken(user.data);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError('Mot de passe incorrect');
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper>
        <Box className="herderTitlePage">
          <Box className="headerLeft">
            <IconButton disabled>
              <LoginIcon
                sx={{ color: 'primary.light' }}
                className="headerButton"
              />
            </IconButton>
            <Typography
              className="headerTitle"
              variant="h6"
              sx={{ color: 'primary.light' }}
            >
              {t('login.title')}
            </Typography>
          </Box>
        </Box>

        <Box className="centeredContainer">
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ width: '35vh' }}>
              <TextField
                label={t('login.password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
              />
              <Typography
                variant="body2"
                sx={{
                  color: error ? 'error.main' : 'transparent',
                  textAlign: 'center',
                  height: '1.5em',
                }}
              >
                {error || ' '}
              </Typography>
              <Button type="submit" sx={{ color: 'secondary.main' }}>
                {t('login.submit')}
              </Button>
            </FormControl>
          </form>
        </Box>
      </Paper>
    </div>
  );
}

export default LoginComponents;
