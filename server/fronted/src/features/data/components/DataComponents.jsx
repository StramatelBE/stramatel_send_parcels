import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { Box, Skeleton, Switch, TextField, Typography } from '@mui/material';
import Container from '../../../components/ContainerComponents';
import dataStore from '../stores/dataStore';
import useData from '../hooks/useData';
import useLoadingStore from '../../../stores/loadingStore';

function DataComponents() {
  const { isLoading } = useLoadingStore();
  return (
    <Container
      icon={Icon()}
      title="Data"
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
    />
  );
}

function Icon() {
  return <EditCalendarIcon sx={{ color: 'primary.light' }} />;
}

function Data() {
  const { data } = dataStore();
  const { updateData } = useData();

  const handleInputChange = (e, item) => {
    let newData;
    if (item.type === 'BOOLEAN') {
      newData = { ...item, data: e.target.checked.toString() };
    } else {
      newData = { ...item, data: e.target.value };
    }
    updateData(newData);
  };
  return (
    <form>
      {data.map((item, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={2}
        >
          <Typography variant="body1">{item.name}</Typography>
          {item.type === 'STRING' && (
            <TextField
              style={{ width: '80%' }}
              margin="normal"
              type="text"
              value={item.data}
              onChange={(e) => handleInputChange(e, item)}
            />
          )}
          {item.type === 'INT' && (
            <TextField
              style={{ width: '30%' }}
              margin="normal"
              type="number"
              value={item.data}
              onChange={(e) => handleInputChange(e, item)}
            />
          )}
          {item.type === 'BOOLEAN' && (
            <Switch
              color="secondary"
              checked={item.data === 'true'}
              onChange={(e) => handleInputChange(e, item)}
            />
          )}
        </Box>
      ))}
    </form>
  );
}

export default DataComponents;
