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
import useData from '../../hooks/useData';
import { useTranslation } from 'react-i18next';

function AddDataDialog({ open, onClose }) {
  const [name, setName] = useState('');
  const { addData } = useData();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addData(name);
    onClose();
    setName('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('dialogs.addData.title')}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: '35vh' }}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              fullWidth
              id="standard-basic"
              label={t('dialogs.addData.name')}
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                onClose();
                setName('');
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
              {t('dialogs.addData.add')}
            </Button>
          </DialogActions>
        </FormControl>
      </form>
    </Dialog>
  );
}

AddDataDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddDataDialog;
