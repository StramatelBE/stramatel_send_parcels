import WarningIcon from '@mui/icons-material/Warning';
import { Box, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Container from '../../../components/ContainerComponents';
import useLoadingStore from '../../../stores/loadingStore';
import useAccident from '../hooks/useAccident';
import accidentStore from '../stores/accidentStore';
import ResetAccidentsOnNewYearDialog from './dialog/resetAccidentsOnNewYearDialog';

function AccidentComponents() {
  const { isLoading } = useLoadingStore();
  const { accidents } = accidentStore();
  const { updateAccident } = useAccident();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (accidents.reset_on_new_year) {
      setOpen(true);
    }
  }, [accidents.reset_on_new_year]);

  const handleClose = (reset) => {
    const updatedAccidents = { ...accidents, reset_on_new_year: false };
    if (reset) {
      updatedAccidents.accidents_this_year = 0;
      updatedAccidents.days_without_accident = 0;
    }
    updateAccident(updatedAccidents);

    setOpen(false);
  };

  return (
    <>
      <Container
        icon={Icon()}
        title="Accident"
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
      <ResetAccidentsOnNewYearDialog open={open} onClose={handleClose} />
    </>
  );
}

function Icon() {
  return <WarningIcon sx={{ color: 'primary.light' }} />;
}

function Accident() {
  const { accidents } = accidentStore();
  const { updateAccident } = useAccident();

  const handleChange = (e, field) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      value = 0;
    }

    let updatedAccidents = {
      ...accidents,
      [field]: value,
    };

    if (
      field === 'days_without_accident' &&
      updatedAccidents.days_without_accident >
        updatedAccidents.record_days_without_accident
    ) {
      updatedAccidents.record_days_without_accident =
        updatedAccidents.days_without_accident;
    }

    if (
      field === 'accidents_this_year' &&
      updatedAccidents.accidents_this_year > accidents.accidents_this_year
    ) {
      updatedAccidents.days_without_accident = 0;
    }

    updateAccident(updatedAccidents);
  };

  return (
    <form style={{ width: '80%' }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <Typography variant="body1">Jour sans accident</Typography>

        <TextField
          style={{ width: '10vh' }}
          margin="normal"
          type="number"
          value={accidents.days_without_accident}
          onChange={(e) => handleChange(e, 'days_without_accident')}
        />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <Typography variant="body1">Accident cette année</Typography>

        <TextField
          style={{ width: '10vh' }}
          margin="normal"
          type="number"
          value={accidents.accidents_this_year}
          onChange={(e) => handleChange(e, 'accidents_this_year')}
        />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <Typography variant="body1">Record de jour sans accident</Typography>

        <TextField
          style={{ width: '10vh' }}
          margin="normal"
          type="number"
          value={accidents.record_days_without_accident}
          onChange={(e) => handleChange(e, 'record_days_without_accident')}
        />
      </Box>
    </form>
  );
}

export default AccidentComponents;
