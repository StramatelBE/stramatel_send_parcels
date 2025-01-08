import { Grid } from '@mui/material';
import DataComponents from '../../data/components/DataComponents';
import PlaylistComponents from '../../playlist/components/PlaylistComponents';
import PreviewComponents from '../../preview/components/PreviewComponents';

function DashboardComponents() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <DataComponents />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PreviewComponents />
      </Grid>
      <Grid item xs={12} sm={3}>
        <PlaylistComponents />
      </Grid>
    </Grid>
  );
}

export default DashboardComponents;
