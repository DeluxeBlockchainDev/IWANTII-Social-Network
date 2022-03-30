import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Countdown from '../../../dto/Countdown';

const styles = () => ({
  dialogTitleRoot: {
    marginBottom: 15
  },
  user: {
    '& .MuiFormControl-root label + div > div': {
      paddingTop: 0
    },
    '& > span': {
      marginRight: 10
    },
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"][class*="MuiOutlinedInput-marginDense"]': {
      padding: 10
    }
  }
});

function EditCountdown(props) {
  const [open, setOpen] = useState(false);
  const [newMode, setNewMode] = useState(false);
  const [countdown, setCountdown] = useState(new Countdown());
  const [countdownDate, setCountdownDate] = React.useState(moment());
  const [userId, setUserId] = React.useState('');
  const [requestId, setRequestId] = React.useState('');
  const {
    classes,
    visible,
    isNew,
    onClose,
    data,
    onSave,
    users,
    requests
  } = props;

  function setDialogState() {
    setOpen(visible);
    setNewMode(isNew);
    setCountdown(data);
    setUserId(data.winner);
    setRequestId(data.request);
    setCountdownDate(moment(countdown.date));
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }

  function saveCountdown(event) {
    event.preventDefault();
    onSave({
      _id: countdown._id,
      name: event.target.name.value,
      winner: userId,
      request: requestId,
      likes: event.target.likes.value,
      dislikes: event.target.dislikes.value,
      createdAt: countdownDate
    });
    handleClose();
  }

  useEffect(setDialogState, [visible, isNew, countdown]);

  return (
    <Dialog
      disableBackdropClick
      maxWidth="md"
      open={open}
      onClose={handleClose}
      className={classes.paper}
    >
      <DialogTitle className={classes.dialogTitleRoot}>
        {newMode ? 'New Countdown' : 'Edit Countdown'}
      </DialogTitle>
      <form onSubmit={saveCountdown}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                name="name"
                label="Countdown name"
                type="text"
                variant="outlined"
                fullWidth
                required
                defaultValue={countdown.name}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={users}
                className={classes.user}
                defaultValue={users.find(item => item._id === countdown.winner)}
                getOptionLabel={option => option.name}
                onChange={(target, val) => {
                  setUserId(val._id);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Winner"
                    variant="outlined"
                    margin="dense"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={requests}
                className={classes.user}
                defaultValue={requests.find(
                  item => item._id === countdown.request
                )}
                getOptionLabel={option => option.text}
                onChange={(target, val) => {
                  setRequestId(val._id);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Winner's request"
                    variant="outlined"
                    margin="dense"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="likes"
                label="Likes"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={countdown.likes}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="dislikes"
                label="Dislikes"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={countdown.dislikes}
              />
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  label="Countdown date"
                  format="DD/MM/YYYY"
                  value={countdownDate}
                  inputVariant="outlined"
                  fullWidth
                  onChange={val => {
                    setCountdownDate(val);
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

EditCountdown.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  isNew: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  requests: PropTypes.array.isRequired
};

export default withStyles(styles)(EditCountdown);
