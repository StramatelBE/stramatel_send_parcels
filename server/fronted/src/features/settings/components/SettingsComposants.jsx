import BugReportIcon from '@mui/icons-material/BugReport';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LockIcon from '@mui/icons-material/Lock';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Grid,
  IconButton,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import Container from '../../../components/ContainerComponents';
import useThemeStore from '../../../stores/themeStore';

function SettingsComposants() {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sm={12}>
        <Container icon={Icon()} title="Settings" content={Settings()} />
      </Grid>
    </Grid>
  );
}

function Icon() {
  return <SettingsIcon sx={{ color: 'primary.light' }} />;
}

function Settings() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Grid container>
      <Grid item xs={12} sm={12}>
        <Stack pl={8} pr={8} spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack spacing={3} direction="row" alignItems="center">
              <IconButton disabled>
                <DarkModeIcon sx={{ color: 'text.secondary' }} />
              </IconButton>
              <Typography variant="h8" sx={{ color: 'text.primary' }}>
                Dark mode
              </Typography>
            </Stack>
            <Switch
              checked={theme === 'dark'}
              onChange={toggleTheme}
              color="secondary"
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={3}>
            <IconButton disabled>
              <BugReportIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
            <Typography variant="h8" sx={{ color: 'text.primary' }}>
              Test panneau
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={3}>
            <IconButton>
              <DateRangeIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
            <Typography variant="h8" sx={{ color: 'text.primary' }}>
              Synchroniser la Date
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={3}>
            <IconButton disabled>
              <LockIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
            <Typography
              variant="h8"
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                padding: '0',
              }}
            >
              Changer le mot de passe
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={3}
          >
            <Stack spacing={3} direction="row" alignItems="center">
              <IconButton disabled>
                <ModeNightIcon sx={{ color: 'text.secondary' }} />
              </IconButton>
              <Typography> Veille</Typography>
            </Stack>
            <Switch color="secondary" />
          </Stack>
          <Stack>
            <Slider
              m={5}
              color="secondary"
              /* value={[veille.start, veille.stop]} */
              min={0}
              max={24}
              step={1}
              marks={[
                { value: 0, label: '0h' },
                { value: 6, label: '6h' },
                { value: 12, label: '12h' },
                { value: 18, label: '18h' },
                { value: 24, label: '24h' },
              ]}
              valueLabelDisplay="auto"
              /*  onChange={handleSliderChange}
                        disabled={veille.enable === false} */
            />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default SettingsComposants;
