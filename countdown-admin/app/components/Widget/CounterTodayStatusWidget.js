import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import { LineChart, Line } from 'recharts';
import { data1 } from 'enl-api/chart/chartMiniData';
import colorfull from 'enl-api/palette/colorfull';
import UsersWallet from '@material-ui/icons/SupervisorAccount';
import CommentsWallet from '@material-ui/icons/MessageOutlined';
import CompareArrows from '@material-ui/icons/Timer';
import boyLogo from 'enl-images/avatars/pp_boy3.svg';
import rippleLogo from 'enl-images/crypto/stellar.png';
import moneroLogo from 'enl-images/crypto/stratis.png';
import iotaLogo from 'enl-images/crypto/ripple.png';
import { injectIntl } from 'react-intl';
import styles from './widget-jss';
import CounterWidget from '../Counter/CounterWidget';
import CounterTrading from '../Counter/CounterTrading';

function CounterTodayStatusWidget(props) {
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
                end={217.89}
                duration={3}
                title="Users of Today"
                logo={boyLogo}
                position="up"
                value={5.6}
                lowest={207.67}
                highest={290.2}
              >
                <LineChart width={240} height={60} data={data1}>
                  <Line
                    type="monotone"
                    dataKey="pv"
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
                end={7.45}
                duration={3}
                title="Countdowns of Today"
                logo={rippleLogo}
                position="down"
                value={1.6}
                lowest={4.67}
                highest={7.45}
              >
                <LineChart width={240} height={60} data={data1}>
                  <Line
                    type="monotone"
                    dataKey="amt"
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
                end={21.66}
                duration={3}
                title="Comments of Today"
                logo={moneroLogo}
                position="up"
                value={1.16}
                lowest={10.12}
                highest={25.72}
              >
                <LineChart width={240} height={60} data={data1}>
                  <Line
                    type="monotone"
                    dataKey="uv"
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
                end={104.78}
                duration={3}
                title="Likes of Today"
                logo={iotaLogo}
                position="down"
                value={2.9}
                lowest={103.01}
                highest={105.2}
              >
                <LineChart width={240} height={60} data={data1}>
                  <Line
                    type="monotone"
                    dataKey="pv"
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
                end={1307}
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
                end={2041}
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
                end={1400}
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

CounterTodayStatusWidget.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(
  withStyles(styles, { withTheme: true })(injectIntl(CounterTodayStatusWidget))
);
