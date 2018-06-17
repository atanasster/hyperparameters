import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default ({ value, label, size }) => (
  <Grid item md={size} sm={12}>
    <Grid container direction="column" alignItems="flex-end">
      <Typography variant="headline" gutterBottom>
        {value}
      </Typography>
      <Typography variant="caption" gutterBottom>
        {label}
      </Typography>
    </Grid>
  </Grid>
)
