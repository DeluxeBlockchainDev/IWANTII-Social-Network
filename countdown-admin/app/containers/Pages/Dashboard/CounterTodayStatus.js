/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import { LineChart, Line } from 'recharts';
import moment from 'moment';
import colorfull from 'enl-api/palette/colorfull';
import UsersWallet from '@material-ui/icons/SupervisorAccount';
import CommentsWallet from '@material-ui/icons/MessageOutlined';
import CompareArrows from '@material-ui/icons/Timer';
import boyLogo from 'enl-images/avatars/pp_boy3.svg';
import rippleLogo from 'enl-images/crypto/stellar.png';
import moneroLogo from 'enl-images/crypto/stratis.png';
import iotaLogo from 'enl-images/crypto/ripple.png';
import { injectIntl } from 'react-intl';
import styles from '../../../components/Widget/widget-jss';
import CounterWidget from '../../../components/Counter/CounterWidget';
import CounterTrading from '../../../components/Counter/CounterTrading';
import { httpRequest } from '../../../helpers/HttpHandler';
import {
  COMMENTS,
  USERS,
  COUNTDOWNS,
  STATISTICS,
  DAYS,
  LIKE
} from '../../../api/consts';

function CounterTodayStatus(props) {
  const [totalComments, setTotalComments] = useState(0);
  const [totalCountdowns, setTotalCountdowns] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersChartData, setUsersChartData] = useState({
    min: 0,
    max: 0,
    today: 0,
    change: 0,
    data: []
  });
  const [countdownChartData, setCountdownChartData] = useState({
    min: 0,
    max: 0,
    today: 0,
    change: 0,
    data: []
  });
  const [commentChartData, setCommentChartData] = useState({
    min: 0,
    max: 0,
    today: 0,
    change: 0,
    data: []
  });
  const [likeChartData, setLikeChartData] = useState({
    min: 0,
    max: 0,
    today: 0,
    change: 0,
    data: []
  });

  const sortByData = dataArray => {
    const resArray = [];
    resArray.push(...dataArray);
    resArray.sort((a, b) => a.data - b.data);
    return resArray;
  };

  const fetchTotal = async () => {
    const users = await httpRequest(`${STATISTICS}${USERS}`, 'GET');
    const comments = await httpRequest(`${STATISTICS}${COMMENTS}`, 'GET');
    const countdowns = await httpRequest(`${STATISTICS}${COUNTDOWNS}`, 'GET');
    setTotalUsers(users.data);
    setTotalComments(comments.data);
    setTotalCountdowns(countdowns.data);
  };

  const fetchUsersStatistics = async () => {
    let charts = [];
    let gap = 0;
    while (gap < DAYS) {
      charts.push(
        httpRequest(
          `${STATISTICS}${USERS}?start=${moment()
            .add(-gap, 'day')
            .format('YYYY-MM-DD')}&end=${moment()
            .add(-gap, 'day')
            .format('YYYY-MM-DD')}`,
          'GET'
        )
      );
      gap++;
    }
    charts.reverse();
    charts = await Promise.all(charts);
    setUsersChartData({
      today: charts[DAYS - 1].data,
      data: charts,
      min: sortByData(charts)[0].data,
      max: sortByData(charts)[DAYS - 1].data,
      change: (charts[DAYS - 1].data / charts[DAYS - 2].data) * 100 - 100
    });
  };

  const fetchCountdownsStatistics = async () => {
    let charts = [];
    let gap = 0;
    while (gap < DAYS) {
      charts.push(
        httpRequest(
          `${STATISTICS}${COUNTDOWNS}?start=${moment()
            .add(-gap, 'day')
            .format('YYYY-MM-DD')}&end=${moment()
            .add(-gap, 'day')
            .format('YYYY-MM-DD')}`,
          'GET'
        )
      );
      gap++;
    }
    charts.reverse();
    charts = await Promise.all(charts);
    setCountdownChartData({
      today: charts[DAYS - 1].data,
      data: charts,
      min: sortByData(charts)[0].data,
      max: sortByData(charts)[DAYS - 1].data,
      change: (charts[DAYS - 1].data / charts[DAYS - 2].data) * 100 - 100
    });
  };

  const fetchCommentStatistics = async () => {
    let charts = [];
    let gap = 0;
    while (gap < DAYS) {
      charts.push(
        httpRequest(
          `${STATISTICS}${COMMENTS}?start=${moment()
            .add(-gap, 'day')
            .format('YYYY-MM-DD')}&end=${moment()
            .add(-gap, 'day')
            .format('YYYY-MM-DD')}`,
          'GET'
        )
      );
      gap++;
    }
    charts.reverse();
    charts = await Promise.all(charts);
    setCommentChartData({
      today: charts[DAYS - 1].data,
      data: charts,
      min: sortByData(charts)[0].data,
      max: sortByData(charts)[DAYS - 1].data,
      change: (charts[DAYS - 1].data / charts[DAYS - 2].data) * 100 - 100
    });
  };

  const fetchLikeStatistics = async () => {
    let charts = [];
    let gap = 0;
    while (gap < DAYS) {
      charts.push(
        httpRequest(
          `${STATISTICS}${LIKE}?start=${moment()
            .add(-gap, 'day')
            .format('YYYY-MM-DD')}&end=${moment()
            .add(-gap, 'day')
            .format('YYYY-MM-DD')}`,
          'GET'
        )
      );
      gap++;
    }
    charts.reverse();
    charts = await Promise.all(charts);
    setLikeChartData({
      today: charts[DAYS - 1].data,
      data: charts,
      min: sortByData(charts)[0].data,
      max: sortByData(charts)[DAYS - 1].data,
      change: (charts[DAYS - 1].data / charts[DAYS - 2].data) * 100 - 100
    });
  };

  useEffect(() => {
    fetchTotal();
    fetchUsersStatistics();
    fetchCountdownsStatistics();
    fetchCommentStatistics();
    fetchLikeStatistics();
  }, []);

  const { classes } = props;
  return (
    <div className={(classes.rootCounter, classes.divider)}>
      <Grid container spacing={2}>
        <Grid item md={9} xs={12}>
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
              <CounterTrading
                color={colorfull[7]}
                start={0}
                end={usersChartData.today}
                duration={3}
                title="Users of Today"
                logo={boyLogo}
                position={usersChartData.change > 0 ? 'up' : 'down'}
                value={Math.abs(usersChartData.change)}
                lowest={usersChartData.min}
                highest={usersChartData.max}
              >
                <LineChart width={240} height={60} data={usersChartData.data}>
                  <Line
                    type="monotone"
                    dataKey="data"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                </LineChart>
              </CounterTrading>
            </Grid>
            <Grid item sm={6} xs={12}>
              <CounterTrading
                color={colorfull[1]}
                start={0}
                end={countdownChartData.today}
                duration={3}
                title="Countdowns of Today"
                logo={rippleLogo}
                position={countdownChartData.change > 0 ? 'up' : 'down'}
                value={Math.abs(countdownChartData.change)}
                lowest={countdownChartData.min}
                highest={countdownChartData.max}
              >
                <LineChart
                  width={240}
                  height={60}
                  data={countdownChartData.data}
                >
                  <Line
                    type="monotone"
                    dataKey="data"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                </LineChart>
              </CounterTrading>
            </Grid>
            <Grid item sm={6} xs={12}>
              <CounterTrading
                color={colorfull[5]}
                start={0}
                end={commentChartData.today}
                duration={3}
                title="Comments of Today"
                logo={moneroLogo}
                position={commentChartData.change > 0 ? 'up' : 'down'}
                value={Math.abs(commentChartData.change)}
                lowest={commentChartData.min}
                highest={commentChartData.max}
              >
                <LineChart width={240} height={60} data={commentChartData.data}>
                  <Line
                    type="monotone"
                    dataKey="data"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                </LineChart>
              </CounterTrading>
            </Grid>
            <Grid item sm={6} xs={12}>
              <CounterTrading
                color={colorfull[4]}
                start={0}
                end={likeChartData.today}
                duration={3}
                title="Likes of Today"
                logo={iotaLogo}
                position={likeChartData.change > 0 ? 'up' : 'down'}
                value={Math.abs(likeChartData.change)}
                lowest={likeChartData.min}
                highest={likeChartData.max}
              >
                <LineChart width={240} height={60} data={likeChartData.data}>
                  <Line
                    type="monotone"
                    dataKey="data"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                </LineChart>
              </CounterTrading>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={3} xs={12}>
          <Grid container spacing={2}>
            <Grid item sm={12} xs={6}>
              <CounterWidget
                color="secondary-main"
                start={0}
                end={totalUsers}
                duration={3}
                title="Total Users"
              >
                <UsersWallet className={classes.counterIcon} />
              </CounterWidget>
            </Grid>
            <Grid item sm={12} xs={6}>
              <CounterWidget
                color="primary-main"
                start={0}
                end={totalCountdowns}
                duration={3}
                title="Total Countdowns"
              >
                <CompareArrows className={classes.counterIcon} />
              </CounterWidget>
            </Grid>
            <Grid item xs={12}>
              <CounterWidget
                color="secondary-main"
                start={0}
                end={totalComments}
                duration={3}
                title="Total Comments"
              >
                <CommentsWallet className={classes.counterIcon} />
              </CounterWidget>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

CounterTodayStatus.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(injectIntl(CounterTodayStatus))
);
