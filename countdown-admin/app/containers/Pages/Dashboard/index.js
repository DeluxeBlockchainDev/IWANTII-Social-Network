import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import brand from 'enl-api/dummy/brand';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import LiveUserArea from './LiveUsersArea';
import StatisticsChartArea from './StatisticsChart';
import CounterTodayStatus from './CounterTodayStatus';
import styles from './dashboard-jss';

function BasicTable(props) {
  const title = brand.name + ' - Dashboard';
  const description = brand.desc;
  const { classes } = props;
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <CounterTodayStatus />
      <StatisticsChartArea />
      <Divider className={classes.divider} />
      <LiveUserArea />
    </div>
  );
}

BasicTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BasicTable);
