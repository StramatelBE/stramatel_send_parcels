import PollIcon from '@mui/icons-material/Poll';
import { Box, Skeleton, Switch, TextField, Typography } from '@mui/material';
import Container from '../../../components/ContainerComponents';
import useLoadingStore from '../../../stores/loadingStore';
import useData from '../hooks/useData';
import dataStore from '../stores/dataStore';

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
  return <PollIcon sx={{ color: 'primary.light' }} />;
}

function Data() {
  const { data } = dataStore();
  const { updateData } = useData();

  const handleInputChange = (e, item) => {
    let newData;
    if (item.type === 'BOOLEAN') {
      newData = { ...item, value: e.target.checked.toString() };
    } else {
      newData = { ...item, value: e.target.value };
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
              value={item.value}
              onChange={(e) => handleInputChange(e, item)}
            />
          )}
          {item.type === 'INT' && (
            <TextField
              style={{ width: '30%' }}
              margin="normal"
              type="number"
              value={item.value}
              onChange={(e) => handleInputChange(e, item)}
            />
          )}
          {item.type === 'BOOLEAN' && (
            <Switch
              color="secondary"
              checked={item.value === 'true'}
              onChange={(e) => handleInputChange(e, item)}
            />
          )}
        </Box>
      ))}
    </form>
  );
}

export default DataComponents;
