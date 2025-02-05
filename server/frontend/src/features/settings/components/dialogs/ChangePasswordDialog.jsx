import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import userService from '../../api/userService';
import { useTranslation } from 'react-i18next';

function ChangePasswordDialog({ open, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    setError('');
    e.preventDefault();
    try {
      await userService.changePassword(currentPassword, newPassword);
      onClose();
    } catch (error) {
      if (error.status === 400) {
        setError(t('dialogs.changePassword.incorrectPassword'));
      }

      if (error.errors[0] && error.errors[0].constraints.minLength) {
        setError(error.errors[0].constraints.minLength);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('dialogs.changePassword.title')}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: '35vh' }}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              sx={{ marginBottom: '12px' }}
              fullWidth
              id="current-password"
              label={t('dialogs.changePassword.currentPassword')}
              type="password"
              autoComplete="off"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              sx={{ marginBottom: '12px' }}
              fullWidth
              id="new-password"
              label={t('dialogs.changePassword.newPassword')}
              type="password"
              autoComplete="off"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              fullWidth
              id="confirm-password"
              label={t('dialogs.changePassword.confirmPassword')}
              type="password"
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </DialogContent>
          <Typography
            variant="body2"
            sx={{
              color: error ? 'error.main' : 'transparent',
              textAlign: 'center',
              height: '1em',
              marginBottom: '12px',
            }}
          >
            {error || ' '}
          </Typography>
          <DialogActions>
            <Button
              onClick={() => {
                onClose();
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setError('');
              }}
              sx={{ color: 'secondary.main' }}
            >
              {t('dialogs.changePassword.cancel')}
            </Button>
            <Button
              type="submit"
              sx={{ color: 'secondary.main' }}
              disabled={!newPassword.trim() || newPassword !== confirmPassword}
            >
              {t('dialogs.changePassword.submit')}
            </Button>
          </DialogActions>
        </FormControl>
      </form>
    </Dialog>
  );
}

ChangePasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChangePasswordDialog;
