import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import 'enl-styles/vendors/react-weather/GenericWeather.css';
import UserIcon from '@material-ui/icons/SupervisorAccount';
import classNames from 'classnames';
import styles from './widget-jss';

function WeatherWidget(props) {
  const {
    status, classes, temp, city
  } = props;
  const cls = classNames('weather--', status);
  const bg = classNames(classes.weathercard);
  const iconClass = classNames(classes.bigIcon, classes.white);
  return (
    <div className={bg}>
      <div className="wheater-wrap">
        <div className={cls}>
          <UserIcon className={iconClass} />
        </div>
        <h1>{temp}</h1>
        <p>{city}</p>
      </div>
    </div>
  );
}

WeatherWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  city: PropTypes.string,
  temp: PropTypes.number,
  status: PropTypes.string
};

WeatherWidget.defaultProps = {
  city: 'Madrid',
  temp: 28,
  status: 'sun' // cloud and sun
};

export default withStyles(styles)(WeatherWidget);
