import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import EditIcon from '@mui/icons-material/Edit';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

import UploadIcon from '@mui/icons-material/Upload';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Container from '../../../components/ContainerComponents';
import useMedia from '../hooks/useMedias';
import usePlaylists from '../hooks/usePlaylists';
import selectedPlaylistStore from '../stores/selectedPlaylistStore';
import UpdatePlaylistDialog from './dialogs/UpdatePLaylistDialog';
import useData from '../../data/hooks/useData';

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
PlaylistDetailsTittle.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

function PlaylistDetailsContent() {
  const { data } = useData();
  const { selectedPlaylist } = selectedPlaylistStore();
  const { deleteMedia, updateMedia, updateMediaTextEditor } = useMedia();
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

  function updataMediasTextEditor(event, media) {
    const selectedDataId = String(event.target.value);
    console.log('media', media, 'selectedDataId', selectedDataId);

    const updatedMedia = {
      ...media,
      path: selectedDataId,
    };
    console.log('updatedMedia', updatedMedia);

    updateMediaTextEditor(updatedMedia);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-medias">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              maxHeight: 'calc(94vh - 200px)',
              overflowY: 'scroll',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
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
                        <TableCell sx={{ padding: '0px' }} align="left">
                          <IconButton>
                            <DragHandleIcon sx={{ color: 'secondary.main' }} />
                          </IconButton>
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: '14vh',
                            maxHeight: '7vh',
                          }}
                        >
                          {media.type.split('/')[0] === 'video' ? (
                            <Box
                              sx={{
                                maxWidth: '14vh',
                                maxHeight: '7vh',
                              }}
                              component="video"
                              alt={media.originalFilename}
                              src={`${media.path}#t=10`}
                            />
                          ) : media.type.split('/')[0] === 'image' ? (
                            <Box
                              sx={{
                                height: '100%',
                                width: '100%',
                                maxWidth: '14vh',
                                maxHeight: '7vh',
                              }}
                              component="img"
                              alt={media.originalFilename}
                              src={`${media.path}`}
                            />
                          ) : (
                            <>
                              <Typography>Text editor</Typography>
                              <Select
                                value={
                                  data.some(
                                    (item) => item.id === parseInt(media.path)
                                  )
                                    ? parseInt(media.path)
                                    : ''
                                }
                                onChange={(e) => {
                                  updataMediasTextEditor(e, media);
                                }}
                                sx={{ width: '100%' }}
                              >
                                {data.map((item, index) => (
                                  <MenuItem key={index} value={item.id}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        </TableCell>
                        <TableCell align="right">
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
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                          >
                            secondes
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ padding: '0px' }} align="right">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMedia(media.id, selectedPlaylist.id);
                            }}
                          >
                            <ClearIcon sx={{ color: 'secondary.main' }} />
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
      <ArrowBackIcon sx={{ color: 'secondary.main' }} />
    </IconButton>
  );
}
function AddMedia() {
  const { uploadMedia, handleAddData } = useMedia();
  const { selectedPlaylist } = selectedPlaylistStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} className="headerButton">
        <AddIcon sx={{ color: 'secondary.main' }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            document.getElementById('inputFile').click();
            handleClose();
          }}
        >
          <UploadIcon sx={{ color: 'secondary.main', mr: 1 }} />
          Upload
        </MenuItem>
        {/*  <MenuItem
          onClick={() => {
            handleAddData('data', selectedPlaylist.id);
            handleClose();
          }}
        >
          Data
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            handleAddData('textEditor', selectedPlaylist.id);
            handleClose();
          }}
        >
          <EditIcon sx={{ color: 'secondary.main', mr: 1 }} />
          Text Editor
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleAddData('information', selectedPlaylist.id);
            handleClose();
          }}
        >
          Information
        </MenuItem> */}
      </Menu>
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
