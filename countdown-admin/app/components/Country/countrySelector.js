/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { countries } from '../../api/consts';

const styles = () => ({
  country: {
    '& .MuiFormControl-root label + div > div': {
      paddingTop: 0
    },
    '& > span': {
      marginRight: 10
    }
  }
});

function CountrySelect(props) {
  const { classes, value, onChange } = props;

  return (
    <Autocomplete
      options={countries}
      className={classes.country}
      defaultValue={value}
      onChange={(target, val) => {
        if (typeof val.code !== 'undefined') {
          onChange(val.code);
        }
      }}
      autoHighlight
      getOptionLabel={option => {
        if (typeof option.label === 'undefined') {
          return countries.find(item => item.code === option).label;
        }
        return option.label;
      }}
      getOptionSelected={(option, val) => {
        if (typeof val.code === 'undefined') {
          return option.code === val;
        }
        return option.code === val.code;
      }}
      renderOption={option => (
        <React.Fragment>
          {option.label}
          {' '}
(
          {option.code}
)
        </React.Fragment>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label="Country"
          variant="outlined"
          required
          inputProps={{
            ...params.inputProps
          }}
        />
      )}
    />
  );
}

CountrySelect.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func
};

CountrySelect.defaultProps = {
  value: '',
  onChange: () => {}
};

export default withStyles(styles)(CountrySelect);
