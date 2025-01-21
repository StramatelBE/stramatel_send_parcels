import { Box, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

function Container({ icon, title, content, headerRight, headerLeft }) {
  return (
    <Grid item xs={12}>
      <Paper className="mainPaperPage">
        <Stack className="herderTitlePage">
          <Box className="headerLeft">
            {headerLeft}
            <IconButton disabled className="headerButton">
              {icon}
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: 'text.primary' }}
              className="headerTitle"
            >
              {title}
            </Typography>
          </Box>
          <Box className="headerRight">{headerRight}</Box>
        </Stack>
        <Box className="containerPage" style={{ alignItems: 'center' }}>
          {content}
        </Box>
      </Paper>
    </Grid>
  );
}

Container.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  headerRight: PropTypes.node,
  headerLeft: PropTypes.node,
};

export default Container;
