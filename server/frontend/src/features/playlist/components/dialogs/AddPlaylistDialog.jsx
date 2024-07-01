import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import usePlaylists from "../../hooks/usePlaylists"; // Added this line

function AddPlaylistDialog({ open, onClose }) {
  const [name, setName] = useState("");
  const { addPlaylist } = usePlaylists();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addPlaylist(name);
    onClose();
    setName("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter une playlist</DialogTitle>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: "35vh" }}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              fullWidth
              id="standard-basic"
              label="Nom du playlist"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                onClose();
                setName("");
              }}
              sx={{ color: "secondary.main" }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              sx={{ color: "secondary.main" }}
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

AddPlaylistDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddPlaylistDialog;
