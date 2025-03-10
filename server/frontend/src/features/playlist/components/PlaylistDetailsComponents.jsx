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
import { useTranslation } from 'react-i18next';
import Container from '../../../components/ContainerComponents';
import useData from '../../data/hooks/useData';
import usePlaylists from '../hooks/usePlaylists';
import usePlaylistsItem from '../hooks/usePlaylistsItem';
import selectedPlaylistStore from '../stores/selectedPlaylistStore';
import UpdatePlaylistDialog from './dialogs/UpdatePLaylistDialog';

function PlaylistDetailsComponents() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  function closeDialog() {
    setOpen(false);
  }

  return (
    <>
      <Container
        icon={<PlaylistDetailsIcon />}
        title={<PlaylistDetailsTittle setOpen={setOpen} />}
        content={PlaylistDetailsContent(t)}
        headerRight={AddPlaylistItem(t)}
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

function PlaylistDetailsContent(t) {
  const { data } = useData();
  const { selectedPlaylist } = selectedPlaylistStore();
  const { updatePlaylistItem, deletePlaylistItem, updatePlaylistItems } =
    usePlaylists();

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedPlaylist.PlaylistItem);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    items.forEach((item, index) => {
      item.position = index;
    });

    updatePlaylistItems(items);
  };

  /*   const sortedMedias = selectedPlaylist.medias.sort(
    (a, b) => a.position - b.position
  ); */

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
                {selectedPlaylist.PlaylistItem.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={String(item.id)}
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
                          {item.media?.type?.split('/')[0] === 'video' ? (
                            <Box
                              sx={{
                                maxWidth: '14vh',
                                maxHeight: '7vh',
                              }}
                              component="video"
                              alt={item.media.originalFilename}
                              src={`${item.media.path}#t=10`}
                            />
                          ) : item.media?.type?.split('/')[0] === 'image' ? (
                            <Box
                              sx={{
                                height: '100%',
                                width: '100%',
                                maxWidth: '14vh',
                                maxHeight: '7vh',
                              }}
                              component="img"
                              alt={item.media.originalFilename}
                              src={`${item.media.path}`}
                            />
                          ) : (
                            <>
                              <Typography>
                                {t('playlistDetails.textEditor')}
                              </Typography>
                              <Select
                                value={item?.data?.id}
                                onChange={(e) => {
                                  updatePlaylistItem({
                                    data_id: e.target.value,
                                    id: item.id,
                                  });
                                }}
                                sx={{ width: '100%' }}
                              >
                                {data?.map((item, index) => (
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
                            value={item.duration}
                            onChange={(e) => {
                              e.preventDefault();
                              updatePlaylistItem({
                                duration: parseInt(e.target.value),
                                id: item.id,
                              });
                            }}
                            size="small"
                            type="number"
                            disabled={
                              item.media?.type?.split('/')[0] === 'video'
                            }
                            inputProps={{ min: 0, max: 999 }}
                            style={{ width: '100%', maxWidth: '90px' }}
                          />
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                          >
                            {t('playlistDetails.seconds')}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ padding: '0px' }} align="right">
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePlaylistItem(item.id, selectedPlaylist);
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
function AddPlaylistItem(t) {
  const { createPlaylistItemMedias, createPlaylistItemEditor } =
    usePlaylistsItem();
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
          {t('playlistDetails.upload')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            createPlaylistItemEditor(selectedPlaylist.id);
            handleClose();
          }}
        >
          <EditIcon sx={{ color: 'secondary.main', mr: 1 }} />
          {t('playlistDetails.textEditor')}
        </MenuItem>
      </Menu>
      <input
        type="file"
        id="inputFile"
        style={{ display: 'none' }}
        onChange={(e) => {
          createPlaylistItemMedias(e.target.files[0]);
        }}
      />
    </>
  );
}
export default PlaylistDetailsComponents;
