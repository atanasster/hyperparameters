import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 14,
  },
  body: {
    fontSize: 16,
  },
}))(TableCell);

const STATES_MAP = ['new', 'running', 'done', 'error'];

export const formatTraingTime = (date, locale = 'en-us') => (
  date ? (new Date(date)).toLocaleDateString(locale, {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }) : undefined
);

export const periodToTime = (duration) => {
  if (!duration) {
    return {
      time: 0,
      units: 'ms',
    };
  }
  const hours = (duration / (1000 * 60 * 60)).toFixed(0);
  const minutes = (duration / (1000 * 60)).toFixed(0);
  if (hours > 0) {
    return {
      time: `${hours}:${minutes}`,
      units: 'hrs',
    };
  }
  const seconds = (duration / 1000).toFixed(0);
  if (minutes > 0) {
    return {
      time: `${minutes}:${seconds}`,
      units: 'min',
    };
  }
  const milliseconds = (duration).toFixed(0);
  if (seconds > 0) {
    return {
      time: `${seconds}:${milliseconds}`,
      units: 'sec',
    };
  }
  return {
    time: `${milliseconds}`,
    units: 'ms',
  };
};

export default ({ classes, experiments }) => {
  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <CustomTableCell rowSpan={2}>#</CustomTableCell>
          <CustomTableCell rowSpan={2} numeric>state</CustomTableCell>
          <CustomTableCell rowSpan={2} numeric>start</CustomTableCell>
          <CustomTableCell rowSpan={2} numeric>duration</CustomTableCell>
          <CustomTableCell style={{ textAlign: 'center' }} colSpan={2}>arguments</CustomTableCell>
          <CustomTableCell style={{ textAlign: 'center' }} colSpan={2}>results</CustomTableCell>
        </TableRow>
        <TableRow>
          <CustomTableCell numeric>optimizer</CustomTableCell>
          <CustomTableCell numeric>epochs</CustomTableCell>
          <CustomTableCell numeric>status</CustomTableCell>
          <CustomTableCell numeric>loss</CustomTableCell>
        </TableRow>

      </TableHead>
      <TableBody>
        {experiments.map(exp => {
          const duration = periodToTime(exp.refresh_time - exp.book_time);
          return (
            <TableRow className={classes.row} key={exp.id}>
              <CustomTableCell component="th" scope="row">
                {exp.id}
              </CustomTableCell>
              <CustomTableCell numeric>{STATES_MAP[exp.state]}</CustomTableCell>
              <CustomTableCell numeric>{formatTraingTime(exp.book_time)}</CustomTableCell>
              <CustomTableCell numeric>{`${duration.time} ${duration.units}`}</CustomTableCell>
              <CustomTableCell numeric>{exp.args.optimizer}</CustomTableCell>
              <CustomTableCell numeric>{exp.args.epochs}</CustomTableCell>
              <CustomTableCell numeric>{exp.result.status}</CustomTableCell>
              <CustomTableCell numeric>{exp.result.loss.toFixed(5)}</CustomTableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
