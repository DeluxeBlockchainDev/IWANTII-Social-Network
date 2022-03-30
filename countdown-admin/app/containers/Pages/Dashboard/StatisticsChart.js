import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PapperBlock, WeatherWidget } from 'enl-components';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import ThemePallete from 'enl-api/palette/themePalette';
import blue from '@material-ui/core/colors/blue';
import moment from 'moment';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import { Grid } from '@material-ui/core';
import { httpRequest } from '../../../helpers/HttpHandler';
import SOCKET from '../../../helpers/Socket';
import {
  STATISTICS,
  COUNTDOWNS,
  USERS,
  SOCKET_NEW_REQUEST,
  SOCKET_END_COUNTDOWN,
  LIKE,
  COMMENTS
} from '../../../api/consts';

const styles = {
  chartFluid: {
    width: '100%',
    minWidth: 500,
    height: 450
  }
};

const theme = createMuiTheme(ThemePallete.yellowCyanTheme);
const color = {
  main: theme.palette.primary.main,
  maindark: theme.palette.primary.dark,
  secondary: theme.palette.secondary.main,
  third: blue[500]
};
const year = new Date().getFullYear();

function CompossedLineBarArea(props) {
  const { classes } = props;
  const [chartData, setChartData] = useState([]);
  const [users, setUsers] = React.useState([]);

  const fetchUsers = async () => {
    const res = await httpRequest(`${USERS}?isLive=true`, 'GET');
    if (res.success) {
      setUsers(res.data);
    }
  };

  /**
   * socket event handler
   */
  const connectSocket = () => {
    // new request
    SOCKET.on(SOCKET_NEW_REQUEST, async () => {
      fetchUsers();
    });
    // end countdown
    SOCKET.on(SOCKET_END_COUNTDOWN, async () => {
      fetchUsers();
    });
  };

  const fetchChartDataItem = async (type, month) => {
    const res = await httpRequest(
      `${STATISTICS}${type}?start=${moment(`${year}-${month}-1`).format(
        'YYYY-MM-DD'
      )}&end=${moment(`${year}-${month}-01`)
        .endOf('month')
        .format('YYYY-MM-DD')}`,
      'GET'
    );
    if (res.success) {
      return res.data;
    }
    return 0;
  };

  const fetchChartData = async () => {
    let chartItem = {
      name: '',
      Countdown: 0,
      User: 0,
      Like: 0,
      Comment: 0
    };
    const data = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < 13; i++) {
      chartItem = {
        name: moment.monthsShort(i - 1),
        // eslint-disable-next-line no-await-in-loop
        Countdown: await fetchChartDataItem(COUNTDOWNS, i),
        // eslint-disable-next-line no-await-in-loop
        User: await fetchChartDataItem(USERS, i),
        // eslint-disable-next-line no-await-in-loop
        Like: await fetchChartDataItem(LIKE, i),
        // eslint-disable-next-line no-await-in-loop
        Comment: await fetchChartDataItem(COMMENTS, i)
      };
      data.push(chartItem);
    }
    setChartData(data);
  };

  useEffect(() => {
    fetchChartData();
    fetchUsers();
    connectSocket();
  }, []);

  return (
    <PapperBlock
      noMargin
      whiteBg
      title="Statistic Chart"
      icon="insert_chart"
      desc="Show statistics of countdown, users, likes, comments by year in chart."
    >
      <Grid container>
        <Grid md={2} sm={12} item>
          <WeatherWidget city="Live Users" temp={users.length} />
        </Grid>
        <Grid md={10} sm={12} item>
          <div className={classes.chartFluid}>
            <ResponsiveContainer>
              <ComposedChart data={chartData}>
                <XAxis dataKey="name" tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickSize={3}
                  tickLine={false}
                  tick={{ stroke: 'none' }}
                />
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <Legend
                  iconType="circle"
                  verticalALign="bottom"
                  iconSize={16}
                />
                <Tooltip />
                <Area
                  type="basis"
                  stackId="2"
                  dataKey="User"
                  stroke="none"
                  fill={color.secondary}
                />
                <Area
                  type="monotone"
                  stackId="1"
                  stroke="none"
                  dataKey="Countdown"
                  fill={color.fourth}
                />
                <Area
                  type="monotone"
                  stackId="3"
                  dataKey="Like"
                  stroke="none"
                  fill={color.main}
                />
                <Line
                  type="monotone"
                  dataKey="Comment"
                  strokeWidth={2}
                  stroke={color.third}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Grid>
      </Grid>
    </PapperBlock>
  );
}

CompossedLineBarArea.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CompossedLineBarArea);
