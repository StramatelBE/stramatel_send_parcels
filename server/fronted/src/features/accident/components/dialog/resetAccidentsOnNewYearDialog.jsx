import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

function ResetAccidentsOnNewYearDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Réinitialiser les accidents cette année</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Voulez-vous réinitialiser les accidents de cette année ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Non
        </Button>
        <Button onClick={() => onClose(true)} color="primary">
          Oui
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ResetAccidentsOnNewYearDialog;
