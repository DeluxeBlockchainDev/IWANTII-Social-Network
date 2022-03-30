import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';

import styles from './email-jss';

function PlaceLoader(props) {
  const { loop, classes } = props;
  const renderElm = [...Array(loop)].map((e, i) => (
    <Accordion className={classes.emailList} key={i.toString()}>
      <AccordionSummary className={classNames(classes.emailSummary, classes.placeLoader)}>
        <div className={classes.fromHeading}>
          <span className={classNames(classes.img, classes.avatar)} />
        </div>
        <div className={classes.textContent}>
          <span className={classes.title} />
          <span className={classes.subtitle} />
        </div>
      </AccordionSummary>
    </Accordion>
  ));

  return (
    <div>
      {renderElm}
    </div>
  );
}

PlaceLoader.propTypes = {
  classes: PropTypes.object.isRequired,
  loop: PropTypes.number.isRequired,
};

export default withStyles(styles)(PlaceLoader);
