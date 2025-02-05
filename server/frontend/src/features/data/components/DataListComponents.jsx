import PollIcon from '@mui/icons-material/Poll';
import {
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import Container from '../../../components/ContainerComponents';
import useLoadingStore from '../../../stores/loadingStore';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useData from '../hooks/useData';
import AddDataDialog from './dialogs/AddDataDialog';

function DataListComponents() {
  const { isLoading } = useLoadingStore();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { t } = useTranslation();

  return (
    <>
      <Container
        icon={Icon()}
        title={t('dataList.title')}
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
            <Data />
          )
        }
        headerRight={<AddDataButton handleOpen={handleOpen} />}
      />
      <AddDataDialog open={open} onClose={handleClose} />
    </>
  );
}

function Icon() {
  return <PollIcon sx={{ color: 'primary.light' }} />;
}
function AddDataButton({ handleOpen }) {
  return (
    <IconButton className="headerButton" onClick={handleOpen}>
      <AddIcon sx={{ color: 'secondary.main' }} />
    </IconButton>
  );
}
AddDataButton.propTypes = {
  handleOpen: PropTypes.func.isRequired,
};
function Data() {
  const { deleteData, data, setSelectedData } = useData();

  return (
    <div style={{ width: '100%' }}>
      <Table size="big">
        <TableBody>
          {data?.map((data) => (
            <TableRow
              sx={{ cursor: 'pointer' }}
              hover
              key={data.id}
              style={{ position: 'relative' }}
            >
              <TableCell
                onClick={() => setSelectedData(data)}
                style={{ padding: '0 16px' }}
              >
                {data.name}
              </TableCell>
              <TableCell
                style={{ width: 'auto', padding: '16px 0px' }}
                align="right"
              >
                <IconButton size="small" onClick={() => deleteData(data.id)}>
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

export default DataListComponents;
