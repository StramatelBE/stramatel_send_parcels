import WarningIcon from '@mui/icons-material/Warning';
import { Box, Skeleton, Switch, TextField, Typography } from '@mui/material';
import Container from '../../../components/ContainerComponents';
import useLoadingStore from '../../../stores/loadingStore';
import accidentStore from '../stores/accidentStore';

function AccidentComponents() {
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
          <Accident />
        )
      }
    />
  );
}

function Icon() {
  return <WarningIcon sx={{ color: 'primary.light' }} />;
}

function Accident() {
  const { accidents } = accidentStore();

  return (
    <form>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <Typography variant="body1">jour sans accident</Typography>

        <TextField
          style={{ width: '30%' }}
          margin="normal"
          type="number"
          value={accidents.days_without_accident}
        />
      </Box>
    </form>
  );
}

export default AccidentComponents;
