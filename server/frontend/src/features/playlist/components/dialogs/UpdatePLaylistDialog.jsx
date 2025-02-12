import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import usePlaylists from '../../hooks/usePlaylists';
import selectedPlaylistStore from '../../stores/selectedPlaylistStore';
import { useTranslation } from 'react-i18next';

function UpdatePlaylistDialog({ open, onClose }) {
  const { selectedPlaylist } = selectedPlaylistStore();
  const { updateNamePlaylist } = usePlaylists();
  const [name, setName] = useState(selectedPlaylist.name);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateNamePlaylist(selectedPlaylist, name);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('dialogs.updatePlaylist.title')}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: '35vh' }}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              fullWidth
              id="standard-basic"
              label={t('dialogs.updatePlaylist.name')}
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                onClose();
                setName(selectedPlaylist.name);
              }}
              sx={{ color: 'secondary.main' }}
            >
              {t('dialogs.changePassword.cancel')}
            </Button>
            <Button
              type="submit"
              sx={{ color: 'secondary.main' }}
              disabled={!name.trim()}
            >
              {t('dialogs.updatePlaylist.update')}
            </Button>
          </DialogActions>
        </FormControl>
      </form>
    </Dialog>
  );
}

UpdatePlaylistDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  playlistId: PropTypes.string.isRequired,
};

export default UpdatePlaylistDialog;
