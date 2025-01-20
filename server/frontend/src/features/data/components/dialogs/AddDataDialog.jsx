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
import useData from '../../hooks/useData'; // Added this line

function AddDataDialog({ open, onClose }) {
  const [name, setName] = useState('');
  const { addData } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name);
    await addData(name);
    onClose();
    setName('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter une donnée</DialogTitle>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: '35vh' }}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              fullWidth
              id="standard-basic"
              label="Nom de la donnée"
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
              Annuler
            </Button>
            <Button
              type="submit"
              sx={{ color: 'secondary.main' }}
              disabled={!name.trim()}
            >
              Ajouter
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
