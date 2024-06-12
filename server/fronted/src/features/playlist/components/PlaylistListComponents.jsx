import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import {
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import Container from "../../../components/ContainerComponents";
import useModes from "../hooks/useMode";
import usePlaylists from "../hooks/usePlaylists";
import modeStore from "../stores/modeStore";
import playlistStore from "../stores/playlistsStores"; // Importez votre store ici
import AddPlaylistDialog from "./dialogs/AddPlaylistDialog";

function PlaylistListComponents() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { addPlaylist } = usePlaylists();

  function closeDialog() {
    setAddDialogOpen(false);
  }

  return (
    <>
      <Container
        icon={<PlaylistIcon />}
        title="Playlists"
        content={<PlaylistList />}
        headerRight={<AddPlaylistButton setAddDialogOpen={setAddDialogOpen} />}
      />
      <AddPlaylistDialog
        open={addDialogOpen}
        onClose={closeDialog}
        addPlaylist={addPlaylist}
      />
    </>
  );
}

function PlaylistIcon() {
  return <EditCalendarIcon sx={{ color: "primary.light" }} />;
}

function PlaylistList() {
  const { modes } = modeStore();
  const { playlists } = playlistStore();
  const { deletePlaylist, getPlaylistById } = usePlaylists();
  const { updateMode } = useModes();

  return (
    <div style={{ width: "100%" }}>
      <Table size="big">
        <TableBody>
          {playlists.map((playlist) => (
            <TableRow hover key={playlist.id} style={{ position: "relative" }}>
              <TableCell
                onClick={() => {
                  getPlaylistById(playlist.id);
                }}
              >
                {playlist.name}
              </TableCell>
              <TableCell align="right">
                {modes &&
                modes.playlist_id === playlist.id &&
                modes.mode === "playlist" ? (
                  <IconButton
                    size="small"
                    onClick={() => updateMode("null", playlist.id)}
                  >
                    <StopIcon sx={{ fontSize: 15, color: "secondary.main" }} />
                    <CircularProgress
                      size={15}
                      sx={{
                        top: 0,
                        left: 0,
                        position: "absolute",
                        color: "secondary.main",
                      }}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    size="small"
                    onClick={() => updateMode("playlist", playlist.id)}
                  >
                    <PlayArrowIcon
                      sx={{ fontSize: 15, color: "secondary.main" }}
                    />
                  </IconButton>
                )}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => deletePlaylist(playlist.id)}
                >
                  <DeleteIcon sx={{ fontSize: 15, color: "secondary.main" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AddPlaylistButton({ setAddDialogOpen }) {
  return (
    <IconButton className="headerButton" onClick={() => setAddDialogOpen(true)}>
      <AddIcon sx={{ color: "secondary.main" }} />
    </IconButton>
  );
}

AddPlaylistButton.propTypes = {
  setAddDialogOpen: PropTypes.func.isRequired,
};

export default PlaylistListComponents;
