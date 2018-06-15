import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';
import blueGrey from '@material-ui/core/colors/blueGrey';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from "@material-ui/core/styles/index";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


const theme = createMuiTheme({
  palette: {
    primary: {
      light: orange[300],
      main: orange[800],
      dark: orange[900],
    },
    secondary: {
      light: blueGrey[300],
      main: blueGrey[500],
      dark: blueGrey[700],
    },
  },
});

const styles = theme => ({
  root: {
    textAlign: 'center',
    flexGrow: 1,
    padding: theme.spacing.unit * 10,
  },
  inforow: {
    padding: theme.spacing.unit,
  },
});

function withRoot(Component) {
  function WithRoot(props) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="title" color="inherit">
              hpjs
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={props.classes.root}>
          <Component {...props} />
        </div>
      </MuiThemeProvider>
    );
  }

  return withStyles(styles)(WithRoot);
}

export default withRoot;
