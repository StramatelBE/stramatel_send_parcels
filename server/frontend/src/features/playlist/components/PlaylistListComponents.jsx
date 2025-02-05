import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import {
  CircularProgress,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Container from '../../../components/ContainerComponents';
import useLoadingStore from '../../../stores/loadingStore';
import useModes from '../hooks/useMode';
import usePlaylists from '../hooks/usePlaylists';
import modeStore from '../stores/modeStore';
import playlistStore from '../stores/playlistsStores'; // Importez votre store ici
import AddPlaylistDialog from './dialogs/AddPlaylistDialog';
import { useTranslation } from 'react-i18next';

function PlaylistListComponents() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { isLoading } = useLoadingStore();
  const { t } = useTranslation();

  function closeDialog() {
    setAddDialogOpen(false);
  }

  return (
    <>
      <Container
        icon={<PlaylistIcon />}
        title={t('playlistList.title')}
        content={
          isLoading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  style={{
                    height: '50px',
                    width: '95%',
                    marginLeft: '2.5%',
                    marginRight: '2.5%',
                    marginBottom: index === 2 ? '0' : '10px',
                    borderRadius: '10px',
                  }}
                />
              ))}
            </>
          ) : (
            <PlaylistList />
          )
        }
        headerRight={<AddPlaylistButton setAddDialogOpen={setAddDialogOpen} />}
      />
      <AddPlaylistDialog open={addDialogOpen} onClose={closeDialog} />
    </>
  );
}

function PlaylistIcon() {
  return <ListIcon sx={{ color: 'primary.light' }} />;
}

function PlaylistList() {
  const { modes } = modeStore();
  const { playlists } = playlistStore();
  const { deletePlaylist, getPlaylistById } = usePlaylists();
  const { updateMode } = useModes();

  return (
    <div style={{ width: '100%' }}>
      <Table size="big">
        <TableBody>
          {playlists?.map((playlist) => (
            <TableRow
              sx={{ cursor: 'pointer' }}
              hover
              key={playlist.id}
              style={{ position: 'relative' }}
            >
              <TableCell
                onClick={() => {
                  getPlaylistById(playlist.id);
                }}
                style={{ padding: '0 16px' }}
              >
                {playlist.name}
              </TableCell>
              <TableCell
                style={{ width: 'auto', padding: '16px 0px' }}
                align="right"
              >
                {modes &&
                modes.playlist_id === playlist.id &&
                modes.name === 'playlist' ? (
                  <IconButton
                    size="small"
                    onClick={() => updateMode('null', null)}
                  >
                    <StopIcon sx={{ fontSize: 15, color: 'secondary.main' }} />
                    <CircularProgress
                      size={15}
                      sx={{
                        top: 5,
                        left: 5,
                        position: 'absolute',
                        color: 'secondary.main',
                      }}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    size="small"
                    onClick={() => updateMode('playlist', playlist.id)}
                  >
                    <PlayArrowIcon
                      sx={{ fontSize: 15, color: 'secondary.main' }}
                    />
                  </IconButton>
                )}
              </TableCell>
              <TableCell
                style={{ width: 'auto', padding: '16px 0px' }}
                align="right"
              >
                <IconButton
                  size="small"
                  onClick={() => deletePlaylist(playlist.id)}
                >
                  <DeleteIcon sx={{ fontSize: 15, color: 'secondary.main' }} />
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
      <AddIcon sx={{ color: 'secondary.main' }} />
    </IconButton>
  );
}

AddPlaylistButton.propTypes = {
  setAddDialogOpen: PropTypes.func.isRequired,
};

export default PlaylistListComponents;
