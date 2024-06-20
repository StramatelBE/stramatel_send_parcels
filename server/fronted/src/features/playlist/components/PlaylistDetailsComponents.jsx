import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import EditIcon from '@mui/icons-material/Edit';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Container from '../../../components/ContainerComponents';
import useMedia from '../hooks/useMedias';
import usePlaylists from '../hooks/usePlaylists';
import selectedPlaylistStore from '../stores/selectedPlaylistStore';
import UpdatePlaylistDialog from './dialogs/UpdatePLaylistDialog';

function PlaylistDetailsComponents() {
  const [open, setOpen] = useState(false);
  function closeDialog() {
    setOpen(false);
  }

  return (
    <>
      <Container
        icon={<PlaylistDetailsIcon />}
        title={<PlaylistDetailsTittle setOpen={setOpen} />}
        content={PlaylistDetailsContent()}
        headerRight={AddMedia()}
        headerLeft={PlaylistDetailsClose()}
      />
      <UpdatePlaylistDialog open={open} onClose={closeDialog} />
    </>
  );
}

function PlaylistDetailsTittle({ setOpen }) {
  const { selectedPlaylist } = selectedPlaylistStore();
  return (
    <Stack direction="row" alignItems="center" spacing={0}>
      <Typography variant="h6">{selectedPlaylist.name}</Typography>
      <IconButton onClick={() => setOpen(true)}>
        <EditIcon sx={{ color: 'secondary.main' }} />
      </IconButton>
    </Stack>
  );
}

function PlaylistDetailsContent() {
  const { selectedPlaylist } = selectedPlaylistStore();
  const { deleteMedia, updateMedia } = useMedia();
  const { updateMediasInPlaylist } = usePlaylists();

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedPlaylist.medias);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    items.forEach((item, index) => {
      item.position = index;
    });

    updateMediasInPlaylist(items, selectedPlaylist);
  };
  const sortedMedias = selectedPlaylist.medias.sort(
    (a, b) => a.position - b.position
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-medias">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Table size="big">
              <TableBody>
                {sortedMedias.map((media, index) => (
                  <Draggable
                    key={media.id}
                    draggableId={String(media.id)}
                    index={index}
                  >
                    {(provided) => (
                      <TableRow
                        style={{ position: 'relative' }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TableCell align="left">
                          <IconButton>
                            <DragHandleIcon sx={{ color: 'secondary.main' }} />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          {media.type.split('/')[0] === 'video' ? (
                            <Box
                              sx={{
                                height: '100%',
                                width: '100%',
                                maxWidth: '16vh',
                                maxHeight: '8vh',
                              }}
                              component="video"
                              alt={media.originalFilename}
                              src={`${media.path}#t=10`}
                            />
                          ) : (
                            <Box
                              sx={{
                                height: '100%',
                                width: '100%',
                                maxWidth: '16vh',
                                maxHeight: '8vh',
                              }}
                              component="img"
                              alt={media.originalFilename}
                              src={`${media.path}`}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={media.duration}
                            onChange={(e) => {
                              e.preventDefault();
                              updateMedia(e, media, selectedPlaylist.id);
                            }}
                            size="small"
                            type="number"
                            disabled={media.type.split('/')[0] === 'video'}
                            inputProps={{ min: 0, max: 999 }}
                            style={{ width: '100%', maxWidth: '90px' }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMedia(media.id, selectedPlaylist.id);
                            }}
                          >
                            <DeleteIcon sx={{ color: 'secondary.main' }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
function PlaylistDetailsIcon() {
  return <EditCalendarIcon sx={{ color: 'primary.light' }} />;
}
function PlaylistDetailsClose() {
  const { clearSelectedPlaylist } = selectedPlaylistStore();
  return (
    <IconButton
      className="headerButton"
      onClick={() => {
        clearSelectedPlaylist();
      }}
    >
      <CloseIcon sx={{ color: 'secondary.main' }} />
    </IconButton>
  );
}
function AddMedia() {
  const { uploadMedia } = useMedia();
  const { selectedPlaylist } = selectedPlaylistStore();
  return (
    <>
      <IconButton
        onClick={() => {
          document.getElementById('inputFile').click();
        }}
        className="headerButton"
      >
        <AddIcon sx={{ color: 'secondary.main' }} />
      </IconButton>
      <input
        type="file"
        id="inputFile"
        style={{ display: 'none' }}
        onChange={(e) => {
          e.preventDefault();
          uploadMedia(e.target.files[0], selectedPlaylist.id);
        }}
      />
    </>
  );
}
export default PlaylistDetailsComponents;
