import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


export default ({ classes, children, title }) => (
  <Grid item xs={12}>
    <Paper className={classes.inforow}>
      <Typography variant="title" align='left' color='primary'>
        {title}
      </Typography>
      <hr />
      <Grid container direction='row' align='space-between' spacing={16}>
        {children}
      </Grid>
    </Paper>
  </Grid>
);
