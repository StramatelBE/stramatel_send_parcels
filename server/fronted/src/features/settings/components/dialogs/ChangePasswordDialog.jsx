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

function ChangePasswordDialog({ open, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    setError('');
    e.preventDefault();
    try {
      await userService.changePassword(currentPassword, newPassword);
      onClose();
    } catch (error) {
      console.log(error.status);
      if (error.status === 400) {
        setError('Mot de passe actuel incorrect');
      }

      if (error.errors[0] && error.errors[0].constraints.minLength) {
        setError(error.errors[0].constraints.minLength);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Changer mot de passe</DialogTitle>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: '35vh' }}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              sx={{ marginBottom: '12px' }}
              fullWidth
              id="current-password"
              label="Mot de passe actuel"
              type="password"
              autoComplete="off"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              sx={{ marginBottom: '12px' }}
              fullWidth
              id="new-password"
              label="Nouveau mot de passe"
              type="password"
              autoComplete="off"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              fullWidth
              id="confirm-password"
              label="Confirmer nouveau mot de passe"
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
              Annuler
            </Button>
            <Button
              type="submit"
              sx={{ color: 'secondary.main' }}
              disabled={!newPassword.trim() || newPassword !== confirmPassword}
            >
              Valider
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
